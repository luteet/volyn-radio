import { useEffect, useRef, useState } from "react";
import type { Sticker } from "../../../../types/stickers";

type Params = {
  canUse: boolean;
  stickers: Sticker[];
  stickerImageUrl: (filename: string) => string;
};

async function loadImageDimensions(src: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => reject(new Error("Failed to load sticker image"));
    img.src = src;
  });
}

export function useStickerSizing({ canUse, stickers, stickerImageUrl }: Params) {
  const [sizeDefaultsByStickerId, setSizeDefaultsByStickerId] = useState<
    Record<string, { wPct: number; hPct: number }>
  >({});
  const loadingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!canUse) return;

    const stageW = Math.max(1, window.innerWidth);
    const stageH = Math.max(1, window.innerHeight);

    for (const s of stickers) {
      const hasSize =
        typeof s.wPct === "number" &&
        Number.isFinite(s.wPct) &&
        typeof s.hPct === "number" &&
        Number.isFinite(s.hPct);
      if (hasSize || sizeDefaultsByStickerId[s.id] || loadingRef.current.has(s.id)) continue;

      loadingRef.current.add(s.id);
      const img = new Image();
      img.onload = () => {
        try {
          const nw = Math.max(1, img.naturalWidth || 1);
          const nh = Math.max(1, img.naturalHeight || 1);
          const widthPx = Math.min(300, nw);
          const heightPx = Math.max(1, widthPx * (nh / nw));
          setSizeDefaultsByStickerId((prev) => ({
            ...prev,
            [s.id]: { wPct: widthPx / stageW, hPct: heightPx / stageH },
          }));
        } finally {
          loadingRef.current.delete(s.id);
        }
      };
      img.onerror = () => loadingRef.current.delete(s.id);
      img.src = stickerImageUrl(s.filename);
    }
  }, [canUse, stickers, sizeDefaultsByStickerId, stickerImageUrl]);

  return { sizeDefaultsByStickerId, loadImageDimensions };
}
