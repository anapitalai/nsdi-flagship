import type { Asset, AssetType, Prisma } from "@prisma/client";

import prisma from "@/lib/db/prisma";

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

export type MinioAssetPayload = {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: string | null;
  fileFormat: string | null;
  objectKey: string | null;
  downloadUrl: string;
  createdAt: string;
  updatedAt: string;
  assetType: {
    id: string;
    name: string;
    slug: string;
    category: string;
    icon: string;
    color: string;
  };
};

export type MinioAssetListResponse = {
  assets: MinioAssetPayload[];
  pageInfo: {
    limit: number;
    offset: number;
    hasNextPage: boolean;
    nextOffset: number | null;
    totalCount: number;
  };
};

type ListMinioAssetsInput = {
  limit: number;
  offset: number;
  query?: string;
};

function normalizeSearchValue(value: string): string {
  return value.trim();
}

function getObjectKeyFromFileUrl(fileUrl: string | null): string | null {
  if (!fileUrl) {
    return null;
  }

  try {
    const url = new URL(fileUrl);
    const objectKey = url.pathname.replace(/^\/+/, "");
    return objectKey || null;
  } catch {
    const objectKey = fileUrl.replace(/^\/+/, "").replace(/\/+$/, "");
    return objectKey || null;
  }
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
    objectKey: getObjectKeyFromFileUrl(asset.fileUrl),
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

function buildMinioAssetWhereClause(query?: string): Prisma.AssetWhereInput {
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

export async function listMinioAssets({
  limit,
  offset,
  query,
}: ListMinioAssetsInput): Promise<MinioAssetListResponse> {
  const where = buildMinioAssetWhereClause(query);

  const [assets, totalCount] = await Promise.all([
    prisma.asset.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit + 1,
      select: minioAssetSelect,
    }),
    prisma.asset.count({
      where,
    }),
  ]);

  const hasNextPage = assets.length > limit;
  const pagedAssets = hasNextPage ? assets.slice(0, limit) : assets;

  return {
    assets: pagedAssets.map((asset) => toMinioAssetPayload(asset as MinioAssetRecord)),
    pageInfo: {
      limit,
      offset,
      hasNextPage,
      nextOffset: hasNextPage ? offset + limit : null,
      totalCount,
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
