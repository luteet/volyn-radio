import { useCallback, useState } from "react";
import type { DraftSticker, Sticker } from "../../../../types/stickers";

type Params = {
  stickersApiBase: string;
  stickerImageUrl: (filename: string) => string;
  draft: DraftSticker | null;
  isDraftBackground: boolean;
  BACKGROUND_LABEL: string;
  setDraft: React.Dispatch<React.SetStateAction<DraftSticker | null>>;
  setStickers: (stickers: Sticker[]) => void;
  setIsPlacing: (v: boolean) => void;
  onClose: () => void;
  bindUploadedToCurrentTrack: boolean;
  shouldShowBound: boolean;
  currentTrackUrl: string | null;
  currentTrackTitle: string | null;
};

async function parseJsonSafe<T>(resp: Response): Promise<T | null> {
  try {
    return (await resp.json()) as T;
  } catch {
    return null;
  }
}

export function useStickerApi({
  stickersApiBase,
  stickerImageUrl,
  draft,
  isDraftBackground,
  BACKGROUND_LABEL,
  setDraft,
  setStickers,
  setIsPlacing,
  onClose,
  bindUploadedToCurrentTrack,
  shouldShowBound,
  currentTrackUrl,
  currentTrackTitle,
}: Params) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function refreshStickers() {
    const resp = await fetch(`${stickersApiBase}/stickers`, { method: "GET" });
    if (!resp.ok) throw new Error(`Failed to load stickers: HTTP ${resp.status}`);
    const json = (await resp.json()) as { stickers?: Sticker[] };
    if (!Array.isArray(json?.stickers)) return;
    setStickers(json.stickers);
  }

  const uploadStickerFile = useCallback(
    async (file: File) => {
      if (!file.type || !String(file.type).startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      setIsUploading(true);
      setUploadError(null);
      try {
        const formData = new FormData();
        formData.append("file", file, file.name);

        const resp = await fetch(`${stickersApiBase}/stickers/upload`, {
          method: "POST",
          body: formData,
        });
        const json = await parseJsonSafe<{
          ok?: boolean;
          error?: string;
          sticker?: { id: string; filename: string };
        }>(resp);

        if (!resp.ok || !json?.ok || !json?.sticker?.id || !json?.sticker?.filename) {
          throw new Error(json?.error || `Upload failed: HTTP ${resp.status}`);
        }

        setDraft({
          id: json.sticker.id,
          filename: json.sticker.filename,
          xPct: 0.5,
          yPct: 0.5,
          wPct: null,
          hPct: null,
          rotationDeg: 0,
          zIndex: 1,
          labels: [],
          trackUrl:
            bindUploadedToCurrentTrack && shouldShowBound && currentTrackUrl
              ? currentTrackUrl
              : null,
          trackTitle:
            bindUploadedToCurrentTrack && shouldShowBound && currentTrackUrl
              ? currentTrackTitle
              : null,
        });
        setIsPlacing(true);
        onClose();
      } finally {
        setIsUploading(false);
      }
    },
    [
      stickersApiBase,
      onClose,
      setIsPlacing,
      bindUploadedToCurrentTrack,
      shouldShowBound,
      currentTrackUrl,
      currentTrackTitle,
    ]
  );

  async function uploadFileByLink(form: HTMLFormElement) {
    const url = new FormData(form).get("link");
    try {
      const resp = await fetch(`${stickersApiBase}/stickers/upload-by-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await parseJsonSafe<{
        ok?: boolean;
        error?: string;
        sticker?: { id: string; filename: string };
      }>(resp);

      if (!resp.ok || !json?.ok || !json?.sticker?.id || !json?.sticker?.filename) {
        throw new Error(json?.error || `Upload failed: HTTP ${resp.status}`);
      }

      setDraft({
        id: json.sticker.id,
        filename: json.sticker.filename,
        xPct: 0.5,
        yPct: 0.5,
        wPct: 0.15,
        hPct: 0.15,
        rotationDeg: 0,
        zIndex: 1,
        labels: [],
        trackUrl:
          bindUploadedToCurrentTrack && shouldShowBound && currentTrackUrl
            ? currentTrackUrl
            : null,
        trackTitle:
          bindUploadedToCurrentTrack && shouldShowBound && currentTrackUrl
            ? currentTrackTitle
            : null,
      });
      setIsPlacing(true);
      onClose();
      form.reset();
    } finally {
      // ignore
    }
  }

  async function submitDraft() {
    if (!draft) return;
    setUploadError(null);
    setIsUploading(true);

    try {
      const stageW = Math.max(1, window.innerWidth);
      const stageH = Math.max(1, window.innerHeight);

      const zIndex =
        typeof draft.zIndex === "number" && Number.isFinite(draft.zIndex)
          ? Math.trunc(draft.zIndex)
          : 1;

      const isBackground = isDraftBackground;
      const xPct = isBackground ? 0.5 : draft.xPct;
      const yPct = isBackground ? 0.5 : draft.yPct;
      const labels = isBackground
        ? [BACKGROUND_LABEL]
        : (Array.isArray(draft.labels) ? draft.labels : []).filter((l) => l !== BACKGROUND_LABEL);
      const rotationDeg =
        isBackground || !Number.isFinite(draft.rotationDeg) ? 0 : draft.rotationDeg;

      let wPct = isBackground ? 1 : (Number.isFinite(draft.wPct) ? draft.wPct : null);
      let hPct = isBackground ? 1 : (Number.isFinite(draft.hPct) ? draft.hPct : null);

      if (!isBackground && (wPct === null || hPct === null)) {
        const dims = await new Promise<{ naturalWidth: number; naturalHeight: number }>(
          (resolve, reject) => {
            const img = new Image();
            img.onload = () =>
              resolve({ naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
            img.onerror = () => reject(new Error("Failed to load sticker image for sizing"));
            img.src = stickerImageUrl(draft.filename);
          }
        );
        const nw = Math.max(1, dims.naturalWidth || 1);
        const nh = Math.max(1, dims.naturalHeight || 1);
        const widthPx = Math.min(300, nw);
        wPct = widthPx / stageW;
        hPct = Math.max(1, widthPx * (nh / nw)) / stageH;
      }

      const resp = await fetch(`${stickersApiBase}/stickers/position`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stickerId: draft.id,
          xPct,
          yPct,
          wPct,
          hPct,
          rotationDeg,
          trackUrl: draft.trackUrl ?? null,
          trackTitle: draft.trackTitle ?? null,
          zIndex,
          labels,
        }),
      });
      const json = await parseJsonSafe<{ ok?: boolean; error?: string }>(resp);
      if (!resp.ok || !json?.ok)
        throw new Error(json?.error || `Position failed: HTTP ${resp.status}`);

      setDraft(null);
      await refreshStickers();
    } finally {
      setIsUploading(false);
    }
  }

  async function deleteSticker(stickerId: string) {
    setUploadError(null);
    setIsUploading(true);
    try {
      const resp = await fetch(
        `${stickersApiBase}/stickers/${encodeURIComponent(stickerId)}`,
        { method: "DELETE" }
      );
      const json = await parseJsonSafe<{ ok?: boolean; error?: string }>(resp);
      if (!resp.ok || !json?.ok)
        throw new Error(json?.error || `Delete failed: HTTP ${resp.status}`);
      setDraft(null);
      await refreshStickers();
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsUploading(false);
    }
  }

  async function removeStickerBinding(stickerId: string) {
    setUploadError(null);
    setIsUploading(true);
    try {
      const resp = await fetch(
        `${stickersApiBase}/stickers/${encodeURIComponent(stickerId)}/binding`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trackUrl: null, trackTitle: null }),
        }
      );
      const json = await parseJsonSafe<{ ok?: boolean; error?: string }>(resp);
      if (!resp.ok || !json?.ok)
        throw new Error(json?.error || `Unbind failed: HTTP ${resp.status}`);
      await refreshStickers();
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsUploading(false);
    }
  }

  function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    void uploadStickerFile(files[0]).catch((e) => {
      setUploadError(e instanceof Error ? e.message : String(e));
    });
  }

  return {
    isUploading,
    uploadError,
    setUploadError,
    uploadStickerFile,
    uploadFileByLink,
    submitDraft,
    deleteSticker,
    removeStickerBinding,
    onFiles,
  };
}
