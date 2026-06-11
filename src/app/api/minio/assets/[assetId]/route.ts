import { NextResponse } from "next/server";

import { getMinioAssetById } from "@/lib/db/minio-assets";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    assetId: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { assetId } = await params;
  const asset = await getMinioAssetById(assetId);

  if (!asset) {
    return NextResponse.json(
      { error: "Asset not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ asset });
}
