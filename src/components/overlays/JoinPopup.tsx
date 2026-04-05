import { formatDuration } from "../../lib/format";
import { Button } from "../ui/Button";
import { useAudio } from "../../contexts/audio";
import { usePlayerStore } from "../../store/playerStore";
import * as S from "./styles/JoinPopup.styles";

export function JoinPopup() {
	const { audioRef } = useAudio();
	const {
		showJoinPopup,
		joinListening
	} = usePlayerStore();
	const track = usePlayerStore((s) => s.queue?.nowPlaying?.track ?? null);
	const positionSeconds = usePlayerStore((s) => s.queue?.positionSeconds ?? 0);
	const durationSeconds = usePlayerStore((s) => s.queue?.nowPlaying?.track?.duration ?? 0);

	if (!showJoinPopup || !track) return null;

	return (
		<S.Main role="dialog" aria-modal="true">
			<S.Content>
				<S.Title>Now playing on Volyn Radio</S.Title>
				<S.About>
					<S.Track title={track.title}>
						{track.title}
					</S.Track>
					<S.Meta>
						{formatDuration(positionSeconds)} / {formatDuration(durationSeconds)}
					</S.Meta>
				</S.About>
				<S.Footer>
					<Button type="button" onClick={() => void joinListening(audioRef.current)}>
						Join listening
					</Button>
				</S.Footer>
			</S.Content>
		</S.Main>
	);
}

