import ReactDOM from "react-dom";
import { useStickersContext } from "./stickersContextDef";
import { StickerStageItem } from "./StickerStageItem";

export function StickersPageLayer() {
  const {
    stickers,
    draft,
    BACKGROUND_LABEL,
    shouldShowBound,
    currentTrackUrl,
    sizeDefaultsByStickerId,
    defaultDraftWPct,
    defaultDraftHPct,
    stickerImageUrl,
  } = useStickersContext();

  return ReactDOM.createPortal(
    stickers.map((s) => {
      const isBackground = Array.isArray(s.labels) && s.labels.includes(BACKGROUND_LABEL);
      if (isBackground) return null;
      if (draft?.id !== s.id && s.trackUrl) {
        if (!shouldShowBound || !currentTrackUrl || s.trackUrl !== currentTrackUrl) return null;
      }

      const wPct =
        typeof s.wPct === "number" && Number.isFinite(s.wPct)
          ? s.wPct
          : (sizeDefaultsByStickerId[s.id]?.wPct ?? defaultDraftWPct);
      const hPct =
        typeof s.hPct === "number" && Number.isFinite(s.hPct)
          ? s.hPct
          : (sizeDefaultsByStickerId[s.id]?.hPct ?? defaultDraftHPct);
      const rotationDeg =
        typeof s.rotationDeg === "number" && Number.isFinite(s.rotationDeg)
          ? s.rotationDeg
          : 0;

      return (
        <StickerStageItem
          key={s.id}
          data={s}
          draft={draft}
          src={stickerImageUrl(s.filename)}
          position={{ wPct, hPct, rotationDeg }}
        />
      );
    }),
    document.querySelector(".page-background-stickers") || document.body
  );
}
