import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import * as S from "./styles/AsidePanel.styles";
import { useStickers } from "./stickers/hooks/useStickers";
import { StickersProvider } from "./stickers/StickersContext";
import { StickerStage } from "./stickers/StickerStage";
import { StickersPageLayer } from "./stickers/StickersPageLayer";
import { UploadSection } from "./stickers/UploadSection";
import { StickerListItem } from "./stickers/StickerListItem";
import { DraftBottomBar } from "./stickers/DraftBottomBar";
import { StickersList } from "./stickers/Stickers.styles";

export function StickersOverlay({
  isOpen,
  onClose,
  stickersApiBase,
  stickerImagesBase,
}: {
  isOpen: boolean;
  onClose: () => void;
  stickersApiBase: string;
  stickerImagesBase: string;
}) {
  const ctx = useStickers({ isOpen, onClose, stickersApiBase, stickerImagesBase });

  if (!ctx.canUse) return null;

  return (
    <StickersProvider value={ctx}>
      <StickerStage />

      <S.Main isOpen={isOpen} role="complementary" aria-hidden={!isOpen}>
        <S.Inner>
          <S.Header>
            <S.Title>Stickers</S.Title>
            <S.CloseButton type="button" onClick={onClose} aria-label="Close">
              <FontAwesomeIcon icon={faXmark} />
            </S.CloseButton>
          </S.Header>

          <S.Container>
            <UploadSection />

            <StickersList aria-label="Stickers list">
              {ctx.stickers.map((s) => (
                <StickerListItem key={s.id} sticker={s} />
              ))}
            </StickersList>
          </S.Container>
        </S.Inner>
      </S.Main>

      <StickersPageLayer />
      <DraftBottomBar />
    </StickersProvider>
  );
}
