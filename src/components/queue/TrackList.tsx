import type { FC } from "react";
import type { Track } from "../../types/queue";
import { usePlayerStore } from "../../store/playerStore";
import { Duration, Icon, Item, ItemInner, List, Title } from "./styles/QueueList.styles";
import Spinner from "../ui/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { formatDuration } from "../../lib/format";

const TrackList: FC<{ data: Track[] }> = ({ data }) => {

	const {
		addTrackToEnqueue,
		submittingTracks
	} = usePlayerStore()

	const handleClick = (data: Track) => {
		addTrackToEnqueue(data);
	}

	return (
		<List>
			{data.map(track => {

				const isBusy = track.id !== null && submittingTracks.has(track.id);

				return (
					<Item key={track.id}>
						<ItemInner
							as="button"
							onClick={() => handleClick(track)}
							{...(isBusy ? { "aria-busy": "true" } : null)}
						>
							<Icon className="icon">
								{isBusy ? <Spinner theme="255, 255, 255" /> : <FontAwesomeIcon icon={faPlay} style={{ color: "white" }} />}
							</Icon>
							<Title className="queueTitle" title={track.title}>
								{track.title}
							</Title>
							<Duration>
								{formatDuration(track.duration)}
							</Duration>
						</ItemInner>
					</Item>
				)
			})}
		</List>
	);
}

export default TrackList;