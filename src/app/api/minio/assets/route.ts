import { NextResponse } from "next/server";

import { listMinioAssets } from "@/lib/db/minio-assets";

export const dynamic = "force-dynamic";

function parseLimit(value: string | null): number {
  const parsed = value ? Number.parseInt(value, 10) : 25;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return 25;
  }

  return Math.min(parsed, 100);
}

function parseOffset(value: string | null): number {
  const parsed = value ? Number.parseInt(value, 10) : 0;

  if (!Number.isInteger(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  const limit = parseLimit(url.searchParams.get("limit"));
  const offset = parseOffset(url.searchParams.get("offset"));
  const query = url.searchParams.get("q") ?? undefined;

  const assets = await listMinioAssets({
    limit,
    offset,
    query,
  });

  return NextResponse.json(assets);
}
