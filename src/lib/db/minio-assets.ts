import type { Asset, AssetType, Prisma } from "@prisma/client";

import prisma from "@/lib/db/prisma";
import {
  getMinioConfig,
  getMinioObjectKeyFromUrl,
  getMinioObjectUrl,
  listMinioBucketObjects,
} from "@/lib/storage/minio";
import type { MinioAssetListResponse, MinioAssetPayload } from "@/types/minio";

const minioAssetSelect = {
  id: true,
  title: true,
  description: true,
  contentType: true,
  fileUrl: true,
  fileName: true,
  fileSize: true,
  fileFormat: true,
  createdAt: true,
  updatedAt: true,
  assetType: {
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      icon: true,
      color: true,
    },
  },
} satisfies Prisma.AssetSelect;

type MinioAssetRecord = Asset & {
  assetType: Pick<AssetType, "id" | "name" | "slug" | "category" | "icon" | "color">;
};

type ListMinioAssetsInput = {
  limit: number;
  offset: number;
  query?: string;
};

function normalizeSearchValue(value: string): string {
  return value.trim();
}

function toSearchableText(asset: MinioAssetPayload): string {
  return [
    asset.title,
    asset.fileName ?? "",
    asset.fileFormat ?? "",
    asset.objectKey ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

function buildDatabaseAssetWhereClause(query?: string): Prisma.AssetWhereInput {
  const trimmedQuery = query ? normalizeSearchValue(query) : "";

  if (!trimmedQuery) {
    return {
      fileUrl: {
        not: null,
      },
    };
  }

  return {
    fileUrl: {
      not: null,
    },
    OR: [
      {
        title: {
          contains: trimmedQuery,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: trimmedQuery,
          mode: "insensitive",
        },
      },
      {
        fileName: {
          contains: trimmedQuery,
          mode: "insensitive",
        },
      },
      {
        fileFormat: {
          contains: trimmedQuery,
          mode: "insensitive",
        },
      },
    ],
  };
}

function toBucketAssetPayload(
  object: Awaited<ReturnType<typeof listMinioBucketObjects>>[number],
  config = getMinioConfig()
): MinioAssetPayload {
  const fileName = object.fileName;
  const title = fileName.replace(/\.[^/.]+$/, "") || fileName;

  return {
    id: object.objectKey,
    title,
    description: null,
    contentType: "file",
    fileUrl: config.publicBaseUrl
      ? getMinioObjectUrl(config, object.objectKey)
      : null,
    fileName,
    fileSize: object.fileSize.toString(),
    fileFormat: fileName.includes(".") ? fileName.split(".").pop() ?? null : null,
    objectKey: object.objectKey,
    downloadUrl: `/api/minio/objects/download/${object.objectKey
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/")}`,
    createdAt: object.lastModified ?? new Date().toISOString(),
    updatedAt: object.lastModified ?? new Date().toISOString(),
    assetType: {
      id: "minio-object",
      name: "file",
      slug: "file",
      category: "reference",
      icon: "File",
      color: "#6b7280",
    },
  };
}

function toMinioAssetPayload(asset: MinioAssetRecord): MinioAssetPayload {
  return {
    id: asset.id,
    title: asset.title,
    description: asset.description,
    contentType: asset.contentType,
    fileUrl: asset.fileUrl,
    fileName: asset.fileName,
    fileSize: asset.fileSize ? asset.fileSize.toString() : null,
    fileFormat: asset.fileFormat,
    objectKey: getMinioObjectKeyFromUrl(asset.fileUrl, process.env.MINIO_BUCKET ?? undefined),
    downloadUrl: `/api/minio/assets/${asset.id}/download`,
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
    assetType: {
      id: asset.assetType.id,
      name: asset.assetType.name,
      slug: asset.assetType.slug,
      category: asset.assetType.category,
      icon: asset.assetType.icon,
      color: asset.assetType.color,
    },
  };
}

export async function listMinioAssets({
  limit,
  offset,
  query,
}: ListMinioAssetsInput): Promise<MinioAssetListResponse> {
  const trimmedQuery = query ? normalizeSearchValue(query) : "";
  const config = getMinioConfig();
  const bucketObjects = await listMinioBucketObjects(config).catch(() => []);
  const bucketAssets = bucketObjects.map((object) => toBucketAssetPayload(object));
  const databaseAssets = await prisma.asset.findMany({
    where: buildDatabaseAssetWhereClause(query),
    orderBy: {
      createdAt: "desc",
    },
    select: minioAssetSelect,
  });
  const dbAssets = databaseAssets.map((asset) => toMinioAssetPayload(asset as MinioAssetRecord));
  const combinedAssets = [...bucketAssets, ...dbAssets];
  const filteredAssets = trimmedQuery
    ? combinedAssets.filter((asset) => toSearchableText(asset).includes(trimmedQuery.toLowerCase()))
    : combinedAssets;
  const dedupedAssets = filteredAssets.filter(
    (asset, index, currentAssets) =>
      currentAssets.findIndex((candidate) => {
        if (asset.objectKey && candidate.objectKey) {
          return candidate.objectKey === asset.objectKey;
        }

        return candidate.downloadUrl === asset.downloadUrl;
      }) === index
  );
  const sortedAssets = dedupedAssets.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  const pagedAssets = sortedAssets.slice(offset, offset + limit);
  const hasNextPage = offset + limit < sortedAssets.length;

  return {
    assets: pagedAssets,
    pageInfo: {
      limit,
      offset,
      hasNextPage,
      nextOffset: hasNextPage ? offset + limit : null,
      totalCount: sortedAssets.length,
    },
  };
}

export async function getMinioAssetById(
  assetId: string
): Promise<MinioAssetPayload | null> {
  const asset = await prisma.asset.findUnique({
    where: {
      id: assetId,
    },
    select: minioAssetSelect,
  });

  return asset ? toMinioAssetPayload(asset as MinioAssetRecord) : null;
}

export async function getMinioAssetByObjectKey(
  objectKey: string
): Promise<MinioAssetPayload | null> {
  const normalizedObjectKey = objectKey.replace(/^\/+/, "");

  const asset = await prisma.asset.findFirst({
    where: {
      fileUrl: {
        endsWith: normalizedObjectKey,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: minioAssetSelect,
  });

  return asset ? toMinioAssetPayload(asset as MinioAssetRecord) : null;
}

export async function getMinioAssetDownloadTarget(
  assetId: string
): Promise<string | null> {
  const asset = await prisma.asset.findUnique({
    where: {
      id: assetId,
    },
    select: {
      fileUrl: true,
    },
  });

  return asset?.fileUrl ?? null;
}
