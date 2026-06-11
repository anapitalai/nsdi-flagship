export type MinioAssetType = {
  id: string;
  name: string;
  slug: string;
  category: string;
  icon: string;
  color: string;
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
  assetType: MinioAssetType;
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
