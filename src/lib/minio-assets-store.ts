import type { MinioAssetListResponse, MinioAssetPayload } from "@/types/minio";

const PAGE_SIZE = 100;

type SnapshotStatus = "idle" | "loading" | "ready" | "error";

type MinioAssetsSnapshot = {
  status: SnapshotStatus;
  data: MinioAssetListResponse | null;
  error: string | null;
};

type Listener = () => void;

let snapshot: MinioAssetsSnapshot = {
  status: "idle",
  data: null,
  error: null,
};

const listeners = new Set<Listener>();
let activeAbortController: AbortController | null = null;
let activeLoadPromise: Promise<void> | null = null;

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

function setSnapshot(nextSnapshot: MinioAssetsSnapshot): void {
  snapshot = nextSnapshot;
  notify();
}

async function fetchAssetsPage(signal: AbortSignal, offset: number): Promise<MinioAssetListResponse> {
  const response = await fetch(`/api/minio/assets?limit=${PAGE_SIZE}&offset=${offset}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to load MinIO assets");
  }

  return (await response.json()) as MinioAssetListResponse;
}

async function runAssetLoad(abortController: AbortController): Promise<void> {
  const aggregatedAssets: MinioAssetPayload[] = [];
  let nextOffset: number | null = 0;
  let latestPageInfo: MinioAssetListResponse["pageInfo"] | null = null;

  setSnapshot({
    status: "loading",
    data: null,
    error: null,
  });

  while (nextOffset !== null && !abortController.signal.aborted) {
    const payload = await fetchAssetsPage(abortController.signal, nextOffset);

    aggregatedAssets.push(...payload.assets);
    latestPageInfo = payload.pageInfo;

    setSnapshot({
      status: "loading",
      data: {
        assets: [...aggregatedAssets],
        pageInfo: payload.pageInfo,
      },
      error: null,
    });

    nextOffset = payload.pageInfo.nextOffset;
  }

  if (abortController.signal.aborted) {
    return;
  }

  if (latestPageInfo) {
    setSnapshot({
      status: "ready",
      data: {
        assets: aggregatedAssets,
        pageInfo: latestPageInfo,
      },
      error: null,
    });
    return;
  }

  setSnapshot({
    status: "ready",
    data: {
      assets: [],
      pageInfo: {
        limit: PAGE_SIZE,
        offset: 0,
        hasNextPage: false,
        nextOffset: null,
        totalCount: 0,
      },
    },
    error: null,
  });
}

function startAssetLoad(forceReload: boolean): Promise<void> {
  if (activeLoadPromise && !forceReload) {
    return activeLoadPromise;
  }

  if (activeAbortController) {
    activeAbortController.abort();
  }

  const abortController = new AbortController();
  activeAbortController = abortController;

  activeLoadPromise = runAssetLoad(abortController)
    .catch((loadError: unknown) => {
      if (
        loadError instanceof DOMException &&
        loadError.name === "AbortError"
      ) {
        return;
      }

      setSnapshot({
        status: "error",
        data: snapshot.data,
        error: loadError instanceof Error ? loadError.message : "Failed to load MinIO assets",
      });
    })
    .finally(() => {
      if (activeAbortController === abortController) {
        activeAbortController = null;
      }

      activeLoadPromise = null;
    });

  return activeLoadPromise;
}

export function subscribeMinioAssets(listener: Listener): () => void {
  listeners.add(listener);

  if (snapshot.status === "idle" && !activeLoadPromise) {
    void startAssetLoad(false);
  }

  return () => {
    listeners.delete(listener);
  };
}

export function getMinioAssetsSnapshot(): MinioAssetsSnapshot {
  return snapshot;
}

export function refreshMinioAssets(): Promise<void> {
  return startAssetLoad(true);
}
