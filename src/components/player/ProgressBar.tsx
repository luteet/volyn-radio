import { usePlayerStore } from "../../store/playerStore";
import { Bar, BarFill, Info, Main } from "./styles/ProgressBar.styles";

export function ProgressBar({
	positionSeconds,
	durationSeconds,
	progress,
	formatTime,
}: {
	positionSeconds: number;
	durationSeconds: number;
	progress: number; // 0..1
	formatTime: (s: number | null | undefined) => string;
}) {

	const isPlaying = usePlayerStore((s) => s.isPlaying);

	return (
		<Main>
			<Info className="mono">
				<span>{formatTime(positionSeconds)}</span>
				<span>/</span>
				<span>{formatTime(durationSeconds)}</span>
			</Info>
			<Bar aria-hidden="true">
				<BarFill isPlaying={isPlaying} style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }} />
			</Bar>
		</Main>
	);
}

