import { NextResponse } from "next/server";

import {
  createMinioPresignedDownloadUrl,
  getMinioConfig,
} from "@/lib/storage/minio";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    objectKey: string[];
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { objectKey } = await params;
  const normalizedObjectKey = objectKey.join("/");

  if (!normalizedObjectKey) {
    return NextResponse.json(
      { error: "Object key is required" },
      { status: 400 }
    );
  }

  const config = getMinioConfig();
  const signedDownloadUrl = createMinioPresignedDownloadUrl(config, {
    objectKey: normalizedObjectKey,
  });

  return NextResponse.redirect(signedDownloadUrl, 302);
}
