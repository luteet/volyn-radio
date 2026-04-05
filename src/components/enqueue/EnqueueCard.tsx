import { EnqueueForm } from "./EnqueueForm";
import { useAppStore } from "../../store/appStore";
import { usePlayerStore } from "../../store/playerStore";
import type { SyntheticEvent } from "react";

export function EnqueueCard() {

	const { error } = useAppStore();
	const {
		youtubeUrl,
		isSubmitting,
		setYoutubeUrl,
		enqueue
	} = usePlayerStore();

	const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault();
		enqueue();
	}

	return (
		<section className="card">
			<h2>
				<span>Add to queue</span>
				<span>
					<svg width="20" height="20">
						<use href="/sprites.svg?2#youtube" />
					</svg>
					<svg width="16" height="16">
						<use href="/sprites.svg?4#spotify" />
					</svg>
				</span>
			</h2>
			<EnqueueForm
				value={youtubeUrl}
				isSubmitting={isSubmitting}
				onChange={setYoutubeUrl}
				onSubmit={handleSubmit}
			/>
			{error ? <p className="error">{error}</p> : null}
		</section>
	);
}

