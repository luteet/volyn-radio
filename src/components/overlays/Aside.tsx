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

		api,
		stickers,

		playerTooltipTitle,

		isPlaying, isPlacing, isOpenPopup,

		setIsOpenPopup,
	} = useAside();

	const isOpenPlayerApp = isOpenPopup === "player";
	const isOpenPlayerHistory = isOpenPopup === "player-history";
	const isOpenStickersUploader = isOpenPopup === "stickers-uploader";

	const stickersApiBase = api ? `${api.apiOrigin}/api` : "";

	return (
		<div ref={asideRef}>
			<S.Main isPlacing={isPlacing} aria-label="App actions">
				<S.Inner>
					{/* Player App */}
					<S.ButtonWrapper>
						<S.Button
							type="button"
							className={isOpenPlayerApp || isPlaying ? "active" : ""}
							aria-label={isOpenPlayerApp ? t("Aside.close_player") : t("Aside.open_player")}
							aria-expanded={isOpenPlayerApp}
							disabled={isPlacing}
							onClick={() => {
								if (isPlacing) return;
								setIsOpenPopup(isPlacing || isOpenPlayerApp ? null : "player");
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
							className={isOpenPlayerHistory ? "active" : ""}
							aria-label={isOpenPlayerHistory ? t("Aside.close_player_history") : t("Aside.open_player_history")}
							aria-expanded={isOpenPlayerHistory}
							disabled={isPlacing}
							onClick={() => {
								if (isPlacing) return;
								setIsOpenPopup(isOpenPlayerHistory ? null : "player-history")
							}}
						>
							<FontAwesomeIcon icon={faList} />
						</S.Button>
					</S.ButtonWrapper>

					{/* Stickers */}
					<S.ButtonWrapper>
						<S.Button
							type="button"
							className={isOpenStickersUploader ? "active" : ""}
							aria-label={isOpenStickersUploader ? t("Aside.close_stickers") : t("Aside.open_stickers")}
							aria-expanded={isOpenStickersUploader}
							disabled={!stickersApiBase || isPlacing}
							onClick={() => {
								if (!stickersApiBase || isPlacing) return;
								setIsOpenPopup(isOpenStickersUploader ? null : "stickers-uploader")
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
			<StickersOverlay />
		</div>
	);
}

