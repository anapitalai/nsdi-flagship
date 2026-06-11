import { NextResponse } from "next/server";

import { getMinioAssetByObjectKey } from "@/lib/db/minio-assets";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    objectKey: string[];
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { objectKey } = await params;
  const normalizedObjectKey = objectKey.join("/");
  const asset = await getMinioAssetByObjectKey(normalizedObjectKey);

  if (!asset) {
    return NextResponse.json(
      { error: "Asset not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ asset });
}
