import type { QueueState } from "../../types/queue";
import { formatDuration } from "../../lib/format";
import { Item, ItemInner, List, Title, Duration } from "./styles/QueueList.styles";

export function QueueList({ queued }: { queued: QueueState["queued"] }) {
	return (
		<List as="ol">
			{queued.map((q) => (
				<Item key={`${q.addedAt}-${q.track.url}`}>
					<ItemInner aria-busy="false">
						<Title title={q.track.title}>
							{q.track.title}
						</Title>
						<Duration>{formatDuration(q.track.duration)}</Duration>
					</ItemInner>
				</Item>
			))}
		</List>
	);
}
