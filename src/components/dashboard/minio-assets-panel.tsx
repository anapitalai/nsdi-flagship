"use client";

import { Download, ExternalLink, Files, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import {
  getMinioAssetsSnapshot,
  refreshMinioAssets,
  subscribeMinioAssets,
} from "@/lib/minio-assets-store";
import type { MinioAssetPayload } from "@/types/minio";

function formatBytes(value: string | null): string {
  if (!value) {
    return "Unknown size";
  }

  const bytes = Number(value);

  if (!Number.isFinite(bytes)) {
    return value;
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let currentValue = bytes / 1024;
  let unitIndex = 0;

  while (currentValue >= 1024 && unitIndex < units.length - 1) {
    currentValue /= 1024;
    unitIndex += 1;
  }

  return `${currentValue.toFixed(currentValue >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function getStorageLabel(asset: MinioAssetPayload): string {
  if (asset.fileUrl) {
    return "Stored";
  }

  return "Pending";
}

export function MinioAssetsPanel() {
  const snapshot = useSyncExternalStore(
    subscribeMinioAssets,
    getMinioAssetsSnapshot,
    getMinioAssetsSnapshot
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState<"newest" | "title" | "size">("newest");
  const data = snapshot.data;
  const isLoading = snapshot.status === "idle" || snapshot.status === "loading";
  const error = snapshot.error;

  const visibleAssets = useMemo(() => {
    if (!data) {
      return [];
    }

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const filteredAssets = normalizedSearchTerm
      ? data.assets.filter((asset) => {
          const searchableText = [
            asset.title,
            asset.fileName ?? "",
            asset.fileFormat ?? "",
            asset.objectKey ?? "",
            asset.assetType.name,
          ]
            .join(" ")
            .toLowerCase();

          return searchableText.includes(normalizedSearchTerm);
        })
      : data.assets;

    return [...filteredAssets].sort((left, right) => {
      if (sortMode === "title") {
        return left.title.localeCompare(right.title);
      }

      if (sortMode === "size") {
        return Number(right.fileSize ?? "0") - Number(left.fileSize ?? "0");
      }

      return right.createdAt.localeCompare(left.createdAt);
    });
  }, [data, searchTerm, sortMode]);

  const loadedAssetsCount = data?.assets.length ?? 0;
  const totalAssetsCount = data?.pageInfo.totalCount ?? 0;
  return (
    <section className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Files className="size-4" />
            MinIO Assets
          </h2>
          <p className="text-sm text-muted-foreground">
            {data
              ? `${totalAssetsCount} assets available in the NSDI bucket`
              : "Loading assets from the NSDI bucket"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => {
              void refreshMinioAssets();
            }}
            className="gap-2"
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search title, file name, format, or object key"
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <button
            type="button"
            onClick={() => setSortMode("newest")}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              sortMode === "newest"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            Newest
          </button>
          <button
            type="button"
            onClick={() => setSortMode("title")}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              sortMode === "title"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            Title
          </button>
          <button
            type="button"
            onClick={() => setSortMode("size")}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              sortMode === "size"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            Size
          </button>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="rounded-md border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
          Loading assets from MinIO...
        </div>
      ) : error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : data ? (
        <>
          {isLoading ? (
            <div className="rounded-md border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
              Loaded {loadedAssetsCount} of {totalAssetsCount} assets. Loading the rest of the
              bucket...
            </div>
          ) : null}

          {visibleAssets.length > 0 ? (
            <ul className="space-y-2">
              {visibleAssets.map((asset) => (
                <li
                  key={asset.id}
                  className="rounded-md border border-border bg-muted/20 px-3 py-3 transition-colors hover:bg-muted/40"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{asset.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {asset.fileName ?? "Untitled file"}{" "}
                        {asset.fileFormat ? `• ${asset.fileFormat}` : ""}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full border border-border bg-background px-2 py-1">
                          {formatBytes(asset.fileSize)}
                        </span>
                        <span className="rounded-full border border-border bg-background px-2 py-1">
                          {asset.assetType.name}
                        </span>
                        <span className="rounded-full border border-border bg-background px-2 py-1">
                          {getStorageLabel(asset)}
                        </span>
                        <span className="rounded-full border border-border bg-background px-2 py-1">
                          {asset.objectKey ?? "No object key"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button asChild variant="outline" size="sm" className="gap-2">
                        <a href={asset.downloadUrl}>
                          <Download className="size-4" />
                          Download
                        </a>
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="gap-2">
                        <a href={asset.fileUrl ?? asset.downloadUrl}>
                          <ExternalLink className="size-4" />
                          Open
                        </a>
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-md border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
              {data ? "No MinIO assets match the current filters." : "No MinIO assets found."}
            </div>
          )}
        </>
      ) : (
        <div className="rounded-md border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
          {data ? "No MinIO assets match the current filters." : "No MinIO assets found."}
        </div>
      )}
    </section>
  );
}
