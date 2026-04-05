import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "../ui/IconButton";
import { QueueList } from "./QueueList";
import { useAudio } from "../../contexts/audio";
import { usePlayerStore } from "../../store/playerStore";
import { Block, Header } from "./styles/QueueCard.styles";

export function QueueCard() {
	const { audioRef } = useAudio();
	const {
		queue,
		clearQueue
	} = usePlayerStore();

	const queued = queue?.queued;

	return (
		<section className="card">
			<Header>
				<h2>Queue</h2>
				<IconButton
					variant="danger"
					size="small"
					onClick={() => void clearQueue(audioRef.current)}
					disabled={!(queued && queued.length)}
					title="Clear queue"
					aria-label="Clear queue"
				>
					<FontAwesomeIcon icon={faTrash} size="sm" />
				</IconButton>
			</Header>
			<Block>
				<QueueList queued={queued ?? []} />
				{!(queued && queued.length) ? <p className="muted">Queue is empty.</p> : null}
			</Block>
		</section>
	);
}

