import crypto from "node:crypto";

export type MinioConfig = {
  endpoint: string;
  port: number;
  useSsl: boolean;
  region: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  publicBaseUrl?: string;
};

type CreateObjectKeyInput = {
  userId: string;
  assetId: string;
  fileName: string;
};

type PresignedDownloadUrlInput = {
  objectKey: string;
  expiresInSeconds?: number;
};

type PresignedRequestUrlInput = {
  method: "GET";
  pathname: string;
  queryParams?: Record<string, string>;
  expiresInSeconds?: number;
};

export type MinioBucketObject = {
  objectKey: string;
  fileName: string;
  fileSize: number;
  lastModified: string | null;
};

const MINIO_TRUTHY_VALUES = new Set(["1", "true", "yes", "on"]);

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function parseBooleanEnv(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  return MINIO_TRUTHY_VALUES.has(value.trim().toLowerCase());
}

function parsePortEnv(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsedPort = Number.parseInt(value, 10);

  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    throw new Error(`Invalid MINIO_PORT value: ${value}`);
  }

  return parsedPort;
}

function parseExpiresInSeconds(value: number | undefined): number {
  if (value === undefined) {
    return 900;
  }

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Invalid presign expiration value: ${value}`);
  }

  return Math.min(value, 604800);
}

function encodeRfc3986(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (character) =>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function buildCanonicalUri(bucket: string, objectKey: string): string {
  const normalizedKey = objectKey.replace(/^\/+/, "");

  return `/${encodeRfc3986(bucket)}/${normalizedKey
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeRfc3986(segment))
    .join("/")}`;
}

function buildCanonicalQueryString(params: Record<string, string>): string {
  return Object.entries(params)
    .sort(([leftKey, leftValue], [rightKey, rightValue]) => {
      const keyComparison = leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;

      if (keyComparison !== 0) {
        return keyComparison;
      }

      return leftValue < rightValue ? -1 : leftValue > rightValue ? 1 : 0;
    })
    .map(([key, value]) => `${encodeRfc3986(key)}=${encodeRfc3986(value)}`)
    .join("&");
}

function createSigningKey(secretKey: string, dateStamp: string, region: string): Buffer {
  const dateKey = crypto.createHmac("sha256", `AWS4${secretKey}`).update(dateStamp).digest();
  const regionKey = crypto.createHmac("sha256", dateKey).update(region).digest();
  const serviceKey = crypto.createHmac("sha256", regionKey).update("s3").digest();

  return crypto.createHmac("sha256", serviceKey).update("aws4_request").digest();
}

function createPresignedRequestUrl(
  config: MinioConfig,
  { method, pathname, queryParams = {}, expiresInSeconds }: PresignedRequestUrlInput
): string {
  const expiresIn = parseExpiresInSeconds(expiresInSeconds);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const host = `${config.endpoint}:${config.port}`;
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const credentialScope = `${dateStamp}/${config.region}/s3/aws4_request`;
  const requestQueryParams = {
    ...queryParams,
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${config.accessKey}/${credentialScope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": expiresIn.toString(),
    "X-Amz-SignedHeaders": "host",
  };
  const canonicalQueryString = buildCanonicalQueryString(requestQueryParams);
  const canonicalHeaders = `host:${host}\n`;
  const payloadHash = "UNSIGNED-PAYLOAD";
  const canonicalRequest = [
    method,
    normalizedPath,
    canonicalQueryString,
    canonicalHeaders,
    "host",
    payloadHash,
  ].join("\n");
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
  ].join("\n");
  const signingKey = createSigningKey(config.secretKey, dateStamp, config.region);
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");
  const scheme = config.useSsl ? "https" : "http";

  return `${scheme}://${host}${normalizedPath}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
}

export function getMinioConfig(): MinioConfig {
  return {
    endpoint: getRequiredEnv("MINIO_ENDPOINT"),
    port: parsePortEnv(process.env.MINIO_PORT, 9000),
    useSsl: parseBooleanEnv(process.env.MINIO_USE_SSL, false),
    region: process.env.MINIO_REGION?.trim() || "us-east-1",
    accessKey: getRequiredEnv("MINIO_ACCESS_KEY"),
    secretKey: getRequiredEnv("MINIO_SECRET_KEY"),
    bucket: getRequiredEnv("MINIO_BUCKET"),
    publicBaseUrl: process.env.MINIO_PUBLIC_BASE_URL?.trim() || undefined,
  };
}

export function createMinioObjectKey({
  userId,
  assetId,
  fileName,
}: CreateObjectKeyInput): string {
  const safeFileName = fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `assets/${userId}/${assetId}/${safeFileName || "file"}`;
}

export function getMinioObjectUrl(
  config: Pick<MinioConfig, "endpoint" | "port" | "useSsl" | "bucket" | "publicBaseUrl">,
  objectKey: string
): string {
  const baseUrl =
    config.publicBaseUrl?.replace(/\/$/, "") ??
    `${config.useSsl ? "https" : "http"}://${config.endpoint}:${config.port}/${config.bucket}`;

  return `${baseUrl}/${objectKey.replace(/^\/+/, "")}`;
}

export function getMinioObjectKeyFromUrl(
  objectUrl: string | null | undefined,
  bucketName?: string
): string | null {
  if (!objectUrl) {
    return null;
  }

  try {
    const url = new URL(objectUrl);
    const pathnameSegments = url.pathname.split("/").filter(Boolean);

    if (pathnameSegments.length === 0) {
      return null;
    }

    if (bucketName && pathnameSegments[0] === bucketName) {
      return pathnameSegments.slice(1).join("/") || null;
    }

    return pathnameSegments.join("/") || null;
  } catch {
    const fallbackSegments = objectUrl.split("/").filter(Boolean);

    if (fallbackSegments.length === 0) {
      return null;
    }

    if (bucketName && fallbackSegments[0] === bucketName) {
      return fallbackSegments.slice(1).join("/") || null;
    }

    return fallbackSegments.join("/") || null;
  }
}

export function createMinioPresignedDownloadUrl(
  config: MinioConfig,
  { objectKey, expiresInSeconds }: PresignedDownloadUrlInput
): string {
  return createPresignedRequestUrl(config, {
    method: "GET",
    pathname: buildCanonicalUri(config.bucket, objectKey),
    expiresInSeconds,
  });
}

function extractTagValue(source: string, tagName: string): string | null {
  const match = source.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`));

  return match?.[1]?.trim() || null;
}

export async function listMinioBucketObjects(
  config: MinioConfig,
  { maxKeys = 1000 }: { maxKeys?: number } = {}
): Promise<MinioBucketObject[]> {
  const objects: MinioBucketObject[] = [];
  let continuationToken: string | null = null;

  while (true) {
    const presignedUrl = createPresignedRequestUrl(config, {
      method: "GET",
      pathname: `/${config.bucket}`,
      queryParams: {
        "list-type": "2",
        "max-keys": String(Math.min(maxKeys, 1000)),
        ...(continuationToken ? { "continuation-token": continuationToken } : {}),
      },
      expiresInSeconds: 60,
    });

    const response = await fetch(presignedUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to list MinIO bucket objects: ${response.status}`);
    }

    const xml = await response.text();
    const contentBlocks = xml.match(/<Contents>[\s\S]*?<\/Contents>/g) ?? [];

    for (const block of contentBlocks) {
      const objectKey = extractTagValue(block, "Key");
      const sizeValue = extractTagValue(block, "Size");

      if (!objectKey || !sizeValue) {
        continue;
      }

      objects.push({
        objectKey,
        fileName: objectKey.split("/").filter(Boolean).pop() ?? objectKey,
        fileSize: Number.parseInt(sizeValue, 10) || 0,
        lastModified: extractTagValue(block, "LastModified"),
      });
    }

    const isTruncated = extractTagValue(xml, "IsTruncated") === "true";
    continuationToken = extractTagValue(xml, "NextContinuationToken");

    if (!isTruncated || !continuationToken) {
      break;
    }
  }

  return objects;
}
