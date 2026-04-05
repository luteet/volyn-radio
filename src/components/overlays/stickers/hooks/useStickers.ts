import { useEffect, useMemo, useRef, useState } from "react";
import { useStickersStore } from "../../../../store/stickersStore";
import { usePlayerStore } from "../../../../store/playerStore";
import type { DraftSticker, Sticker } from "../../../../types/stickers";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { useStickerApi } from "./useStickerApi";
import { useDraftEditor } from "./useDraftEditor";
import { useStickerSizing } from "./useStickerSizing";

export type { ResizeDir, EditorSession } from "./useDraftEditor";

const BACKGROUND_LABEL = "background";

const stickerLabelMeta: Record<string, { icon: typeof faLayerGroup; title: string }> = {
  background: { icon: faLayerGroup, title: "Background" },
};

export const useStickers = ({
  isOpen,
  onClose,
  stickersApiBase,
  stickerImagesBase,
}: {
  isOpen: boolean;
  onClose: () => void;
  stickersApiBase: string;
  stickerImagesBase: string;
}) => {
  // — Store —
  const stickers = useStickersStore((s) => s.stickers);
  const setStickers = useStickersStore((s) => s.setStickers);
  const setIsPlacing = useStickersStore((s) => s.setIsPlacing);

  // — Player state —
  const nowPlayingTrack = usePlayerStore((s) => s.queue?.nowPlaying?.track ?? null);
  const { isPlayPending, isPlayLoading } = usePlayerStore();
  const isPaused = usePlayerStore((s) => s.queue?.paused ?? true);
  const currentTrackUrl = nowPlayingTrack?.url ?? null;
  const currentTrackTitle = nowPlayingTrack?.title ?? null;
  const isPlaying = Boolean(nowPlayingTrack?.url) && !isPaused;
  const shouldShowBound = isPlaying && !isPlayPending && !isPlayLoading;

  // — Draft state —
  const [draft, setDraft] = useState<DraftSticker | null>(null);
  const isDraftBackground = Boolean(draft?.labels?.includes(BACKGROUND_LABEL));

  // — Upload bind state —
  const [bindUploadedToCurrentTrack, setBindUploadedToCurrentTrack] = useState(false);
  const effectiveBind = bindUploadedToCurrentTrack && shouldShowBound;

  // — Refs —
  const stageRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // — Derived —
  const canUse = Boolean(stickersApiBase && stickerImagesBase);
  const stickerImageUrl = useMemo(
    () => (filename: string) => `${stickerImagesBase}/${filename}`,
    [stickerImagesBase]
  );
  const stageW = Math.max(1, window.innerWidth);
  const defaultDraftWPct = 300 / stageW;
  const defaultDraftHPct = defaultDraftWPct;

  // — Sub-hooks —
  const api = useStickerApi({
    stickersApiBase,
    stickerImageUrl,
    draft,
    isDraftBackground,
    BACKGROUND_LABEL,
    setDraft,
    setStickers,
    setIsPlacing,
    onClose,
    bindUploadedToCurrentTrack: effectiveBind,
    shouldShowBound,
    currentTrackUrl,
    currentTrackTitle,
  });

  const editor = useDraftEditor({ draft, isDraftBackground, isUploading: api.isUploading, stageRef, setDraft });

  const { sizeDefaultsByStickerId, loadImageDimensions } = useStickerSizing({
    canUse,
    stickers,
    stickerImageUrl,
  });

  // — Draft: close panel when placing —
  useEffect(() => {
    const placing = Boolean(draft);
    setIsPlacing(placing);
    if (placing) onClose();
  }, [draft, onClose, setIsPlacing]);

  // — Draft: resolve missing size/rotation from image dimensions —
  useEffect(() => {
    if (!canUse || !draft) return;

    const wOk = typeof draft.wPct === "number" && Number.isFinite(draft.wPct);
    const hOk = typeof draft.hPct === "number" && Number.isFinite(draft.hPct);
    const rotationOk = typeof draft.rotationDeg === "number" && Number.isFinite(draft.rotationDeg);
    if (wOk && hOk && rotationOk) return;

    const stageW = Math.max(1, window.innerWidth);
    const stageH = Math.max(1, window.innerHeight);
    let cancelled = false;

    void loadImageDimensions(stickerImageUrl(draft.filename))
      .then(({ w, h }) => {
        if (cancelled) return;
        const widthPx = Math.min(300, Math.max(1, w));
        const heightPx = Math.max(1, widthPx * (Math.max(1, h) / Math.max(1, w)));
        setDraft((d) => {
          if (!d || d.id !== draft.id) return d;
          return {
            ...d,
            wPct: wOk ? d.wPct : widthPx / stageW,
            hPct: hOk ? d.hPct : heightPx / stageH,
            rotationDeg: rotationOk ? d.rotationDeg : 0,
          };
        });
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [canUse, draft, stickerImageUrl, loadImageDimensions]);

  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // — Drag-and-drop file upload —
  const { isUploading, uploadStickerFile, setUploadError } = api;
  useEffect(() => {
    if (!canUse || !isOpen || draft || isUploading) return;

    const onDragOver = (e: DragEvent) => {
      if (!e.dataTransfer) return;
      e.preventDefault();
      setIsDraggingFile(true);
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingFile(false);
      const file = e.dataTransfer?.files?.[0];
      if (!file) return;
      void uploadStickerFile(file).catch((err) => {
        setUploadError(err instanceof Error ? err.message : String(err));
      });
    };

    window.addEventListener("dragover", onDragOver);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("drop", onDrop);
    };
  }, [canUse, isOpen, draft, isUploading, uploadStickerFile, setUploadError]);

  // — startPlacingSticker: open existing sticker for editing —
  function startPlacingSticker(s: Sticker) {
    api.setUploadError(null);
    setDraft({
      id: s.id,
      filename: s.filename,
      xPct: s.xPct,
      yPct: s.yPct,
      wPct: typeof s.wPct === "number" ? s.wPct : null,
      hPct: typeof s.hPct === "number" ? s.hPct : null,
      rotationDeg: typeof s.rotationDeg === "number" ? s.rotationDeg : 0,
      zIndex: typeof s.zIndex === "number" ? s.zIndex : 1,
      trackUrl: typeof s.trackUrl === "string" ? s.trackUrl : null,
      trackTitle: typeof s.trackTitle === "string" ? s.trackTitle : null,
      labels: Array.isArray(s.labels) ? s.labels : [],
    });
    setIsPlacing(true);
    onClose();
  }

  return {
    stageRef,
    fileInputRef,

    BACKGROUND_LABEL,
    stickerLabelMeta,

    canUse,
    stickers,
    draft,
    setDraft,
    isDraftBackground,
    isDraggingFile,
    shouldShowBound,
    currentTrackUrl,
    currentTrackTitle,
    sizeDefaultsByStickerId,
    bindUploadedToCurrentTrack: effectiveBind,
    setBindUploadedToCurrentTrack,
    stickerImageUrl,
    defaultDraftWPct,
    defaultDraftHPct,

    startPlacingSticker,

    // from useStickerApi
    isUploading: api.isUploading,
    uploadError: api.uploadError,
    setUploadError: api.setUploadError,
    uploadStickerFile: api.uploadStickerFile,
    uploadFileByLink: api.uploadFileByLink,
    submitDraft: api.submitDraft,
    deleteSticker: api.deleteSticker,
    removeStickerBinding: api.removeStickerBinding,
    onFiles: api.onFiles,

    // from useDraftEditor
    onDraftPointerDown: editor.onDraftPointerDown,
    onEditorBoxPointerDown: editor.onEditorBoxPointerDown,
    onResizeHandlePointerDown: editor.onResizeHandlePointerDown,
    onRotateHandlePointerDown: editor.onRotateHandlePointerDown,
  };
};
