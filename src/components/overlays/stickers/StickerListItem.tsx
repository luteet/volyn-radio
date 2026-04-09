import type { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import type { Sticker } from "../../../types/stickers";
import { IconButton } from "../../ui/IconButton";
import { useStickersContext } from "./stickersContextDef";
import { StickerThumb } from "./StickerThumb";
import * as S from "./Stickers.styles";

interface Props {
  sticker: Sticker;
}

export const StickerListItem: FC<Props> = ({ sticker: s }) => {
  const { isUploading, stickerLabelMeta, stickerImageUrl, startPlacingSticker, deleteSticker, removeStickerBinding } =
    useStickersContext();

  return (
    <S.StickerCard>
      <S.StickerCardMain
        type="button"
        onClick={() => startPlacingSticker(s)}
        aria-label={`Edit sticker ${s.id}`}
        disabled={isUploading}
      >
        <S.StickerCardThumb>
          <S.StickerLabelBadges aria-hidden="true">
            {(Array.isArray(s.labels) ? s.labels : []).map((labelId) => {
              const meta = stickerLabelMeta[labelId];
              if (!meta) return null;
              return (
                <S.StickerLabelBadge key={labelId} title={meta.title}>
                  <FontAwesomeIcon icon={meta.icon} />
                </S.StickerLabelBadge>
              );
            })}
          </S.StickerLabelBadges>
          <StickerThumb src={stickerImageUrl(s.filename)} />
        </S.StickerCardThumb>
      </S.StickerCardMain>

      <S.StickerCardActions>
        <S.StickerCardCoords className="mono">
          {Math.round(s.xPct * 100)}% / {Math.round(s.yPct * 100)}%
        </S.StickerCardCoords>
        <IconButton
          variant="danger"
          size="small"
          title="Delete"
          aria-label={`Delete sticker ${s.id}`}
          disabled={isUploading}
          onClick={() => void deleteSticker(s.id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </IconButton>
      </S.StickerCardActions>

      <S.StickerCardBinding>
        {s.trackUrl ? (
          <>
            <S.StickerCardBindingTitle
              className="mono"
              title={s.trackTitle || s.trackUrl || "Unknown track"}
            >
              <span>Only on</span>
              <S.StickerCardBindingInfoIcon>
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  title={s.trackTitle || s.trackUrl || "Unknown track"}
                  aria-label={s.trackTitle || s.trackUrl || "Unknown track"}
                />
              </S.StickerCardBindingInfoIcon>
            </S.StickerCardBindingTitle>
            <IconButton
              variant="secondary"
              size="small"
              title="Unbind from track"
              aria-label={`Unbind sticker ${s.id} from track`}
              disabled={isUploading}
              onClick={() => void removeStickerBinding(s.id)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </>
        ) : (
          <S.StickerCardBindingTitle className="mono">
            <span>Always shown</span>
          </S.StickerCardBindingTitle>
        )}
      </S.StickerCardBinding>
    </S.StickerCard>
  );
};
