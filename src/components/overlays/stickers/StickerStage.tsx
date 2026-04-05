import ReactDOM from "react-dom";
import { useStickersContext } from "./stickersContextDef";
import type { ResizeDir } from "./hooks/useStickers";
import * as S from "./Stickers.styles";

export function StickerStage() {
  const {
    stageRef,
    stickers,
    draft,
    isDraftBackground,
    isUploading,
    isDraggingFile,
    BACKGROUND_LABEL,
    shouldShowBound,
    currentTrackUrl,
    defaultDraftWPct,
    defaultDraftHPct,
    stickerImageUrl,
    onDraftPointerDown,
    onEditorBoxPointerDown,
    onResizeHandlePointerDown,
    onRotateHandlePointerDown,
  } = useStickersContext();

  const wPct =
    draft && typeof draft.wPct === "number" && Number.isFinite(draft.wPct)
      ? draft.wPct
      : defaultDraftWPct;
  const hPct =
    draft && typeof draft.hPct === "number" && Number.isFinite(draft.hPct)
      ? draft.hPct
      : defaultDraftHPct;
  const rotationDeg =
    draft && typeof draft.rotationDeg === "number" && Number.isFinite(draft.rotationDeg)
      ? draft.rotationDeg
      : 0;

  return (
    <S.Stage
      ref={stageRef}
      interactive={(draft && !isDraftBackground) || isUploading || isDraggingFile}
    >
      {ReactDOM.createPortal(
        <S.BackgroundLayer>
          {stickers.map((s) => {
            const isBackground =
              Array.isArray(s.labels) && s.labels.includes(BACKGROUND_LABEL);
            if (!isBackground) return null;

            if (draft?.id !== s.id && s.trackUrl) {
              if (!shouldShowBound || !currentTrackUrl || s.trackUrl !== currentTrackUrl)
                return null;
            }

            return (
              <S.BackgroundImage
                key={s.id}
                editingOriginal={draft?.id === s.id}
                src={stickerImageUrl(s.filename)}
                alt=""
                draggable={false}
                style={{
                  zIndex:
                    typeof s.zIndex === "number" && Number.isFinite(s.zIndex) ? s.zIndex : 1,
                }}
              />
            );
          })}
          {draft && isDraftBackground ? (
            <S.BackgroundImage
              src={stickerImageUrl(draft.filename)}
              alt=""
              draggable={false}
              style={{
                zIndex:
                  typeof draft.zIndex === "number" && Number.isFinite(draft.zIndex)
                    ? draft.zIndex
                    : 1,
              }}
            />
          ) : null}
        </S.BackgroundLayer>,
        document.querySelector(".page-background-images") || document.body
      )}

      {draft && !isDraftBackground ? (
        <>
          <S.StageItem
            isDraft
            src={stickerImageUrl(draft.filename)}
            alt=""
            draggable={false}
            onPointerDown={onDraftPointerDown}
            style={{
              left: `${draft.xPct * 100}%`,
              top: `${draft.yPct * 100}%`,
              width: `${wPct * 100}%`,
              height: "auto",
              aspectRatio: `${wPct * 100} / ${hPct * 100}`,
              transform: `translate(-50%, -50%) rotate(${rotationDeg}deg)`,
              zIndex:
                typeof draft.zIndex === "number" && Number.isFinite(draft.zIndex)
                  ? draft.zIndex
                  : 1,
            }}
          />

          <S.EditorBox
            onPointerDown={onEditorBoxPointerDown}
            style={{
              left: `${draft.xPct * 100}%`,
              top: `${draft.yPct * 100}%`,
              width: `${wPct * 100}%`,
              height: "auto",
              aspectRatio: `${wPct * 100} / ${hPct * 100}`,
            }}
          >
            {(["nw", "n", "ne", "w", "e", "sw", "s", "se"] as ResizeDir[]).map((dir) => (
              <S.EditorHandle
                key={dir}
                dir={dir}
                onPointerDown={(e) => onResizeHandlePointerDown(e, dir)}
              />
            ))}
            <S.RotateHandle onPointerDown={onRotateHandlePointerDown} />
          </S.EditorBox>
        </>
      ) : null}
    </S.Stage>
  );
}
