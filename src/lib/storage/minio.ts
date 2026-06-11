export type MinioConfig = {
  endpoint: string;
  port: number;
  useSsl: boolean;
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

export function getMinioConfig(): MinioConfig {
  return {
    endpoint: getRequiredEnv("MINIO_ENDPOINT"),
    port: parsePortEnv(process.env.MINIO_PORT, 9000),
    useSsl: parseBooleanEnv(process.env.MINIO_USE_SSL, false),
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
