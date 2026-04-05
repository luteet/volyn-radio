import { useRef, type FC, type RefObject } from "react";
import * as PanelStyles from "./styles/AsidePanel.styles";
import { AudioProvider } from "../../contexts/AudioContext";
import { useAppStore } from "../../store/appStore";
import { useStickersStore } from "../../store/stickersStore";
import { JoinPopup } from "./JoinPopup";
import { Header } from "../layout/Header";
import { PlayerCard } from "../player/PlayerCard";
import { EnqueueCard } from "../enqueue/EnqueueCard";
import { QueueCard } from "../queue/QueueCard";
import usePlayerContent from "./hooks/usePlayerContent";

const Content: FC<{ audioRef: RefObject<HTMLAudioElement | null> }> = ({ audioRef }) => {

	usePlayerContent(audioRef);

	return (
		<>
			<JoinPopup />
			<Header />
			<PlayerCard />
			<EnqueueCard />
			<QueueCard />
			{/* <Footer /> */}
		</>
	);
}

const PlayerApp: FC = () => {

	const { isOpenPopup } = useAppStore();
	const { isPlacing } = useStickersStore();

	const audioRef = useRef<HTMLAudioElement | null>(null);

	return (
		<PanelStyles.Main
			isOpen={isOpenPopup === "player" && !isPlacing}
			aria-hidden={isOpenPopup !== "player" || isPlacing}
			role="complementary"
		>
			<PanelStyles.Inner>
				<AudioProvider audioRef={audioRef}>
					<Content audioRef={audioRef} />
				</AudioProvider>
			</PanelStyles.Inner>
		</PanelStyles.Main>
	);
}

export default PlayerApp;
