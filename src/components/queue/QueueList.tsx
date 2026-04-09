import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import type { QueueState } from "../../types/queue";
import { formatDuration } from "../../lib/format";
import { Item, ItemInner, List, Title, Duration } from "./styles/QueueList.styles";
import { PaginationArea, PaginationBtn, PaginationLabel } from "../overlays/styles/AsidePanel.styles";

const PAGE_SIZE = 10;

export function QueueList({ queued }: { queued: QueueState["queued"] }) {
	const [page, setPage] = useState(1);

	const totalPages = Math.max(1, Math.ceil(queued.length / PAGE_SIZE));
	const effectivePage = Math.min(page, totalPages);

	const visible = queued.slice((effectivePage - 1) * PAGE_SIZE, effectivePage * PAGE_SIZE);

	return (
		<>
			<List as="ol" style={totalPages > 1 ? { minHeight: `${PAGE_SIZE * 48 - 8}px` } : undefined}>
				{visible.map((q) => (
					<Item key={q.track.id}>
						<ItemInner aria-busy="false">
							<Title title={q.track.title}>
								{q.track.title}
							</Title>
							<Duration>{formatDuration(q.track.duration)}</Duration>
						</ItemInner>
					</Item>
				))}
			</List>
			{totalPages > 1 && (
				<PaginationArea>
					<PaginationBtn
						onClick={() => setPage(p => p - 1)}
						disabled={effectivePage <= 1}
						aria-label="Previous page"
					>
						<FontAwesomeIcon icon={faChevronLeft} />
					</PaginationBtn>
					<PaginationLabel>{effectivePage} / {totalPages}</PaginationLabel>
					<PaginationBtn
						onClick={() => setPage(p => p + 1)}
						disabled={effectivePage >= totalPages}
						aria-label="Next page"
					>
						<FontAwesomeIcon icon={faChevronRight} />
					</PaginationBtn>
				</PaginationArea>
			)}
		</>
	);
}
