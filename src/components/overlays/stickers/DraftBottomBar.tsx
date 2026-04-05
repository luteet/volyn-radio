import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "../../ui/IconButton";
import { Input } from "../../ui/Input";
import { useStickersContext } from "./stickersContextDef";
import * as S from "./Stickers.styles";

export function DraftBottomBar() {
  const {
    draft,
    isDraftBackground,
    isUploading,
    shouldShowBound,
    currentTrackUrl,
    currentTrackTitle,
    BACKGROUND_LABEL,
    submitDraft,
    setDraft,
    setUploadError,
  } = useStickersContext();

  if (!draft) return null;

  return (
    <S.BottomActions role="group" aria-label="Sticker editor">
      <S.BottomBindRow>
        <S.BottomBindCheckbox>
          <input
            type="checkbox"
            checked={Boolean(
              shouldShowBound &&
                currentTrackUrl &&
                draft.trackUrl &&
                draft.trackUrl === currentTrackUrl
            )}
            disabled={!shouldShowBound || isUploading}
            onChange={(e) => {
              const nextChecked = e.target.checked;
              if (!shouldShowBound || !currentTrackUrl) return;
              setDraft((d) => {
                if (!d) return d;
                if (nextChecked) {
                  return { ...d, trackUrl: currentTrackUrl, trackTitle: currentTrackTitle };
                }
                return { ...d, trackUrl: null, trackTitle: null };
              });
            }}
          />
          <span>Show only while playing</span>
        </S.BottomBindCheckbox>

        {draft.trackUrl ? (
          <S.BottomBindMeta className="mono">
            Attached: {draft.trackTitle || "Unknown track"}
            <IconButton
              variant="secondary"
              size="small"
              title="Unbind"
              aria-label="Unbind sticker from track"
              disabled={!draft.trackUrl || isUploading}
              onClick={() => setDraft((d) => (d ? { ...d, trackUrl: null, trackTitle: null } : d))}
            >
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </S.BottomBindMeta>
        ) : (
          <S.BottomBindMeta className="mono">Always shown</S.BottomBindMeta>
        )}
      </S.BottomBindRow>

      <S.BottomBGRow>
        <S.BottomBindCheckbox>
          <input
            type="checkbox"
            checked={isDraftBackground}
            onChange={(e) => {
              const next = e.target.checked;
              setDraft((d) => {
                if (!d) return d;
                if (next) {
                  return {
                    ...d,
                    labels: [BACKGROUND_LABEL],
                    xPct: 0.5,
                    yPct: 0.5,
                    wPct: 1,
                    hPct: 1,
                    rotationDeg: 0,
                  };
                }
                return {
                  ...d,
                  labels: Array.isArray(d.labels)
                    ? d.labels.filter((l) => l !== BACKGROUND_LABEL)
                    : [],
                };
              });
            }}
          />
          <span>Background (cover)</span>
        </S.BottomBindCheckbox>
      </S.BottomBGRow>

      <S.BottomZIndexRow>
        <S.BottomZIndexLabel className="mono">z-index</S.BottomZIndexLabel>
        <Input
          type="number"
          step={1}
          min={0}
          value={
            typeof draft.zIndex === "number" && Number.isFinite(draft.zIndex)
              ? Math.trunc(draft.zIndex)
              : 1
          }
          onChange={(e) => {
            const v = Number(e.target.value);
            setDraft((d) => {
              if (!d) return d;
              if (!Number.isFinite(v)) return { ...d, zIndex: 1 };
              return { ...d, zIndex: Math.trunc(v) };
            });
          }}
        />
      </S.BottomZIndexRow>

      <S.BottomBtnRow>
        <IconButton
          variant="secondary"
          title="Confirm"
          aria-label="Confirm sticker placement"
          disabled={isUploading}
          onClick={() => void submitDraft()}
        >
          <FontAwesomeIcon icon={faCheck} />
        </IconButton>
        <IconButton
          variant="danger"
          size="default"
          title="Cancel"
          aria-label="Cancel sticker placement"
          disabled={isUploading}
          onClick={() => {
            if (isUploading) return;
            setDraft(null);
            setUploadError(null);
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </IconButton>
      </S.BottomBtnRow>
    </S.BottomActions>
  );
}
