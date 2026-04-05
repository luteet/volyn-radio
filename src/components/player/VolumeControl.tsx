import type { ChangeEvent, CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, Main, Slider } from "./styles/Volume.styles";

export function VolumeControl({
	volume,
	isMuted,
	onToggleMute,
	onChangeVolume,
}: {
	volume: number;
	isMuted: boolean;
	onToggleMute: () => void;
	onChangeVolume: (v: number) => void;
}) {
	return (
		<Main>
			<Button
				type="button"
				onClick={onToggleMute}
				title={isMuted ? "Unmute" : "Mute"}
				aria-label={isMuted ? "Unmute" : "Mute"}
			>
				<FontAwesomeIcon icon={isMuted || volume === 0 ? faVolumeXmark : faVolumeHigh} size="lg" />
			</Button>
			<Slider
				type="range"
				min={0}
				max={1}
				step={0.01}
				value={volume}
				style={{ "--value": volume * 100 + "%" } as CSSProperties}
				onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeVolume(Number(e.target.value))}
			/>
		</Main>
	);
}

