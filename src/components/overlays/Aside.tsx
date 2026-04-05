import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faMusic } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { StickersOverlay } from "./StickersOverlay";
import PlayerHistory from "./PlayerHistory";
import * as S from "./styles/Aside.styles";
import { useTranslation } from "react-i18next";
import PlayerApp from "./PlayerApp";
import useAside from "./hooks/useAside";

export function Aside() {

	const { t } = useTranslation();

	const {
		asideRef,

		stickers,
		stickersApiBase,
		stickerImagesBase,

		playerTooltipTitle,

		isPlaying, isPlacing, isOpenPopup,

		setIsOpenPopup,
		handleClose
	} = useAside();

	return (
		<div ref={asideRef}>
			<S.Main isPlacing={isPlacing} aria-label="App actions">
				<S.Inner>
					{/* Player App */}
					<S.ButtonWrapper>
						<S.Button
							type="button"
							className={isOpenPopup === "player" || isPlaying ? "active" : ""}
							aria-label={isOpenPopup === "player" ? t("Aside.close_player") : t("Aside.open_player")}
							aria-expanded={isOpenPopup === "player"}
							disabled={isPlacing}
							onClick={() => {
								if (isPlacing) return;
								setIsOpenPopup(isPlacing || isOpenPopup === "player" ? null : "player");
							}}
						>
							<FontAwesomeIcon icon={faMusic} />
						</S.Button>

						{playerTooltipTitle && isOpenPopup === null ? (
							<S.ButtonTooltip role="tooltip">
								{playerTooltipTitle}
							</S.ButtonTooltip>
						) : null}
					</S.ButtonWrapper>

					{/* Player History */}
					<S.ButtonWrapper>
						<S.Button
							type="button"
							className={isOpenPopup === "player-history" ? "active" : ""}
							aria-label={isOpenPopup === "player-history" ? t("Aside.close_player_history") : t("Aside.open_player_history")}
							aria-expanded={isOpenPopup === "player-history"}
							disabled={isPlacing}
							onClick={() => {
								if (isPlacing) return;
								setIsOpenPopup(isOpenPopup === "player-history" ? null : "player-history")
							}}
						>
							<FontAwesomeIcon icon={faList} />
						</S.Button>
					</S.ButtonWrapper>

					{/* Stickers */}
					<S.ButtonWrapper>
						<S.Button
							type="button"
							className={isOpenPopup === "stickers-uploader" ? "active" : ""}
							aria-label={isOpenPopup === "stickers-uploader" ? t("Aside.close_stickers") : t("Aside.open_stickers")}
							aria-expanded={isOpenPopup === "stickers-uploader"}
							disabled={!stickersApiBase || isPlacing}
							onClick={() => {
								if (!stickersApiBase || isPlacing) return;
								setIsOpenPopup(isOpenPopup === "stickers-uploader" ? null : "stickers-uploader")
							}}
						>
							<FontAwesomeIcon icon={faImage} />
						</S.Button>

						{isOpenPopup === null ? (
							<S.ButtonTooltip className="buttonTooltip" role="tooltip">
								{t("Aside.stickers_label")}: {stickers.length}
							</S.ButtonTooltip>
						) : null}
					</S.ButtonWrapper>
				</S.Inner>
			</S.Main>

			{/* Player App */}
			<PlayerApp />

			{/* Player History */}
			<PlayerHistory />

			{/* Stickers */}
			<StickersOverlay
				isOpen={isOpenPopup === "stickers-uploader" && !isPlacing}
				onClose={handleClose}
				stickersApiBase={stickersApiBase || ""}
				stickerImagesBase={stickerImagesBase || ""}
			/>
		</div>
	);
}

