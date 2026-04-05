import type { FC } from "react";
import type { Sticker, DraftSticker } from "../../../types/stickers";
import * as S from "./Stickers.styles";

interface Props {
  data: Sticker;
  draft?: DraftSticker | null;
  src: string;
  position: { wPct: number; hPct: number; rotationDeg: number };
}

export const StickerStageItem: FC<Props> = ({ data, draft, src, position }) => {
  return (
    <S.StageItem
      key={data.id}
      editingOriginal={draft?.id === data.id}
      src={src}
      alt=""
      draggable={false}
      style={{
        left: `${data.xPct * 100}%`,
        top: `${data.yPct * 100}%`,
        width: `${position.wPct * 100}%`,
        height: "auto",
        aspectRatio: `${position.wPct * 100} / ${position.hPct * 100}`,
        transform: `translate(-50%, -50%) rotate(${position.rotationDeg}deg)`,
        zIndex:
          typeof data.zIndex === "number" && Number.isFinite(data.zIndex) ? data.zIndex : 1,
      }}
    />
  );
};
