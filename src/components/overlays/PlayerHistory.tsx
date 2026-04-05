import { type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import TrackList from "../queue/TrackList";
import { CloseButton, Container, Header, Inner, Main, Title } from "./styles/AsidePanel.styles";
import usePlayerHistory from "./hooks/usePlayerHistory";

const PlayerHistory: FC = () => {

	const {
		isOpenPopup,
		data,

		handleClose
	} = usePlayerHistory();

	return (
		<Main isOpen={isOpenPopup === "player-history"} role="complementary" aria-hidden={isOpenPopup !== "player-history"}>
			<Inner>
				<Header>
					<Title>History</Title>
					<CloseButton type="button" onClick={handleClose} aria-label="Close">
						<FontAwesomeIcon icon={faXmark} />
					</CloseButton>
				</Header>
				<Container>
					<TrackList data={data} />
				</Container>
			</Inner>
		</Main>
	)
}

export default PlayerHistory;
