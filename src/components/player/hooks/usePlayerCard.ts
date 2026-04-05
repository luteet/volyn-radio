import { useEffect } from "react";
import { useApiConfig } from "../../../contexts/apiConfig";
import { useAudio } from "../../../contexts/audio";
import { useAppStore } from "../../../store/appStore";
import { usePlayerStore } from "../../../store/playerStore";

const usePlayerCard = () => {

	// Contexts and stores
	const { streamBase } = useApiConfig();
	const { audioRef } = useAudio();

	const {
		socketStatus,
		socketRef
	} = useAppStore();

	const {
		queue,
		isPlayLoading,
		isPlaying,
		isNextLoading,
		volume,
		isMuted,

		togglePlay,
		nextTrack,
		toggleMute,
		setVolume,
		clearQueue,
	} = usePlayerStore();

	// Derived state
	const currentTrack = queue?.nowPlaying?.track ?? null;
	const currentPosition = queue?.positionSeconds ?? 0;
	const currentDuration = currentTrack?.duration ?? 0;
	const progress =
		currentDuration > 0 ? Math.min(1, Math.max(0, currentPosition / currentDuration)) : 0;

	const hasQueued = (queue?.queued?.length ?? 0) > 0;
	const hasNext = hasQueued;
	const isGloballyPaused = queue?.paused ?? true;
	const canStart = socketStatus === "connected" && (Boolean(queue?.nowPlaying?.track?.url) || hasQueued);
	const hasSomethingToPlay = Boolean(queue?.nowPlaying?.track?.url || hasQueued);

	// Effect for emitting track progress every second when playing
	useEffect(() => {
		if (isPlaying && !isPlayLoading) {
			setTimeout(() => progress !== 0 && socketRef?.emit("trackProgress", progress * 100), 1000);
		}
	}, [progress, isPlaying, isPlayLoading, socketRef]);

	// Public API of the hook
	return {
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
	}

}

export default usePlayerCard;
