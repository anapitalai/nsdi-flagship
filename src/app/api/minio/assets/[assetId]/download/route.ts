import { NextResponse } from "next/server";

import { getMinioAssetDownloadTarget } from "@/lib/db/minio-assets";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    assetId: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { assetId } = await params;
  const downloadTarget = await getMinioAssetDownloadTarget(assetId);

  if (!downloadTarget) {
    return NextResponse.json(
      { error: "Asset not found" },
      { status: 404 }
    );
  }

  return NextResponse.redirect(downloadTarget, 302);
}
