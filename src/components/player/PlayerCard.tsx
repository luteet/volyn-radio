import { formatDuration } from "../../lib/format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForwardStep, faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../ui/Spinner";
import { IconButton } from "../ui/IconButton";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { Controls, ControlsRow, Main, NowPlaying, NowPlayingTitle } from "./styles/PlayerCard.styles";
import usePlayerCard from "./hooks/usePlayerCard";

export function PlayerCard() {

	const {
		streamBase,
		socketStatus,
		audioRef,

		currentTrack,
		currentPosition,
		currentDuration,
		progress,

		hasNext,
		canStart,
		hasSomethingToPlay,
		isGloballyPaused,
		isNextLoading,
		isPlayLoading,

		volume,
		isMuted,

		togglePlay,
		nextTrack,
		toggleMute,
		setVolume,
		clearQueue,
	} = usePlayerCard();

	return (
		<Main>
			<NowPlaying>
				<NowPlayingTitle title={currentTrack?.title || ""}>
					{currentTrack?.title || "—"}
				</NowPlayingTitle>
			</NowPlaying>

			<ProgressBar
				positionSeconds={currentPosition}
				durationSeconds={currentDuration}
				progress={progress}
				formatTime={formatDuration}
			/>

			<Controls>
				<ControlsRow>
					<IconButton
						onClick={() => togglePlay(audioRef.current)}
						disabled={isPlayLoading || !canStart || socketStatus !== "connected"}
						title={isGloballyPaused ? "Play" : "Pause"}
						aria-label={isGloballyPaused ? "Play" : "Pause"}
					>
						{isPlayLoading ? (
							<Spinner />
						) : (
							<FontAwesomeIcon icon={isGloballyPaused ? faPlay : faPause} size="lg" />
						)}
					</IconButton>
					<IconButton
						variant="secondary"
						onClick={nextTrack}
						disabled={!currentTrack?.url || !hasNext || isNextLoading || socketStatus !== "connected"}
						title="Next"
						aria-label="Next"
					>
						{isNextLoading ? <Spinner /> : <FontAwesomeIcon icon={faForwardStep} size="lg" />}
					</IconButton>
					<IconButton
						variant="danger"
						onClick={() => void clearQueue(audioRef.current)}
						disabled={!hasSomethingToPlay || socketStatus !== "connected"}
						title="Stop and clear queue"
						aria-label="Stop and clear queue"
					>
						<FontAwesomeIcon icon={faStop} size="lg" />
					</IconButton>
				</ControlsRow>

				<VolumeControl
					volume={volume}
					isMuted={isMuted}
					onToggleMute={toggleMute}
					onChangeVolume={setVolume}
				/>

				<audio
					ref={audioRef}
					preload="none"
					src={`${streamBase}/stream`}
				/>
			</Controls>
		</Main>
	);
}
