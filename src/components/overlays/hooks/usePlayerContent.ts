import { useEffect, useRef, type RefObject } from "react";
import { useApiConfig } from "../../../contexts/apiConfig";
import { usePlayerStore } from "../../../store/playerStore";
import { useAudioElementSync } from "../../../hooks/useAudioElementSync";
import { useAudioLoadingSync } from "../../../hooks/useAudioLoadingSync";

const usePlayerContent = (audioRef: RefObject<HTMLAudioElement | null>) => {

	// Contexts and stores
	const { streamBase } = useApiConfig();
	const {
		queue,
		hasUserInteracted,
		setShowJoinPopup,
		setIsPlayLoading,
		setIsPlayPending,
		setError,
		togglePlay,
	} = usePlayerStore();
	const queueTitle = usePlayerStore((s) => s.queue?.nowPlaying?.track?.title);
	const isGloballyPaused = usePlayerStore((s) => s.queue?.paused ?? true);
	const isPausedFlag = usePlayerStore((s) => s.queue?.paused ?? false);
	const reconnectRevision = usePlayerStore((s) => s.reconnectRevision);

	// Sync the audio element's src and play/pause state with the player store.
	useAudioElementSync(audioRef);
	useAudioLoadingSync(audioRef);

	// Show the "join" popup if the user hasn't interacted yet and a track is playing.
	useEffect(() => {
		const hasTrack = Boolean(queueTitle);
		const isPlaying = hasTrack && !isGloballyPaused;
		if (isPlaying && !hasUserInteracted) {
			setShowJoinPopup(true);
		} else if (!isPlaying) {
			setShowJoinPopup(false);
		}
	}, [queueTitle, isGloballyPaused, hasUserInteracted, setShowJoinPopup]);

	// When exiting pause mode or changing tracks, we recreate the HTTP stream,
	// so that there isn't a phase of "old buffer -> silence -> new sound".
	const prevPausedRef = useRef<boolean | null>(null);
	const prevTrackUrlRef = useRef<string | null>(null);

	// On socket reconnect to an active session: pre-connect the stream so "Join" is instant.
	// We also reset prev refs to prevent the regular stream effect from treating this as a no-op.
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !reconnectRevision) return;
		const state = queue;
		if (!state?.nowPlaying?.track?.url || state.paused) return;

		audio.src = `${streamBase}/stream?ts=${Date.now()}`;
		prevPausedRef.current = state.paused;
		prevTrackUrlRef.current = state.nowPlaying.track.url;
		setIsPlayPending(false);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reconnectRevision]);

	// We only want to auto-play if the user has already interacted with the page, otherwise we just set the source and wait for them to click play.
	useEffect(() => {
		const audio = audioRef.current;
		const state = queue;
		if (!audio || !state) return;

		const trackUrl = state.nowPlaying?.track?.url ?? null;
		const pausedNow = Boolean(state.paused);
		const pausedPrev = prevPausedRef.current;
		const trackPrev = prevTrackUrlRef.current;

		const trackChanged = Boolean(trackUrl && trackUrl !== trackPrev);
		const resumedFromPause = pausedPrev === true && pausedNow === false;
		const shouldReconnect = !pausedNow && (trackChanged || resumedFromPause);

		prevPausedRef.current = pausedNow;
		prevTrackUrlRef.current = trackUrl;

		if (!shouldReconnect || !trackUrl) return;

		// When resuming from pause (same track), skip if the browser already has a live
		// stream — native media controls may have resumed it without our involvement.
		// For track changes, always reconnect to get the new track's stream.
		if (!trackChanged && !audio.paused) return;

		// A new track or resuming from a pause: we re-establish the connection and enable pending.
		audio.src = `${streamBase}/stream?ts=${state.serverTimeMs}`;
		setIsPlayPending(true);
		if (hasUserInteracted) {
			void audio.play().catch((e) => {
				setIsPlayPending(false);
				setIsPlayLoading(false);
				setError(e instanceof Error ? e.message : String(e));
			});
		}
	}, [
		audioRef,
		queue,
		streamBase,
		hasUserInteracted,
		setError,
		setIsPlayLoading,
		setIsPlayPending,
	]);

	// Flag set before programmatic audio.pause()/play() so native event listeners
	// below don't mistake our own calls for user gestures on browser media controls.
	const programmaticActionRef = useRef(false);

	// Synchronising the pause with the backend signal: as soon as `queue.paused` returns `true`,
	// We immediately stop the local audio and shut down the loader.
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		if (isPausedFlag && !audio.paused) {
			programmaticActionRef.current = true;
			audio.pause();
			setIsPlayLoading(false);
		}
	}, [audioRef, isPausedFlag, setIsPlayLoading]);

	// Proxy native browser media controls (OS media keys, browser player UI) to the backend.
	// Without this, native pause/play changes local audio state but backend doesn't know.
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const onNativePause = () => {
			if (programmaticActionRef.current) {
				programmaticActionRef.current = false;
				return;
			}
			if (!isPausedFlag) void togglePlay(audio);
		};

		const onNativePlay = () => {
			if (programmaticActionRef.current) {
				programmaticActionRef.current = false;
				return;
			}
			if (isPausedFlag) void togglePlay(audio);
		};

		audio.addEventListener("pause", onNativePause);
		audio.addEventListener("play", onNativePlay);
		return () => {
			audio.removeEventListener("pause", onNativePause);
			audio.removeEventListener("play", onNativePlay);
		};
	}, [audioRef, isPausedFlag, togglePlay]);

}

export default usePlayerContent;
