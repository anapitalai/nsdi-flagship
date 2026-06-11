import { NextResponse } from "next/server";

import { getMinioAssetById } from "@/lib/db/minio-assets";
import {
  createMinioPresignedDownloadUrl,
  getMinioConfig,
  getMinioObjectKeyFromUrl,
} from "@/lib/storage/minio";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    assetId: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { assetId } = await params;
  const asset = await getMinioAssetById(assetId);

  if (!asset?.fileUrl) {
    return NextResponse.json(
      { error: "Asset not found" },
      { status: 404 }
    );
  }

  const config = getMinioConfig();
  const objectKey =
    asset.objectKey ?? getMinioObjectKeyFromUrl(asset.fileUrl, config.bucket);

  if (!objectKey) {
    return NextResponse.json(
      { error: "Asset download target is unavailable" },
      { status: 500 }
    );
  }

  const signedDownloadUrl = createMinioPresignedDownloadUrl(config, {
    objectKey,
  });

  return NextResponse.redirect(signedDownloadUrl, 302);
}
