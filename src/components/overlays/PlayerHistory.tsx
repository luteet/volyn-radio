import { type FC, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import TrackList from "../queue/TrackList";
import {
	CloseButton,
	Container,
	Header,
	Inner,
	Main,
	PaginationArea,
	PaginationBtn,
	PaginationLabel,
	SearchInput,
	Title,
} from "./styles/AsidePanel.styles";
import usePlayerHistory from "./hooks/usePlayerHistory";

const ITEM_HEIGHT = 48;

const PlayerHistory: FC = () => {

	const {
		isOpenPopup,
		data,
		handleClose
	} = usePlayerHistory();

	const containerRef = useRef<HTMLDivElement>(null);
	const [containerHeight, setContainerHeight] = useState(0);
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const observer = new ResizeObserver(([entry]) => {
			setContainerHeight(entry.contentRect.height);
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const filtered = search.trim()
		? data.filter(item => item.title.toLowerCase().includes(search.trim().toLowerCase()))
		: data;

	const pageSize = Math.max(1, Math.floor(containerHeight / ITEM_HEIGHT));
	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const effectivePage = Math.min(page, totalPages);
	const visible = filtered.slice((effectivePage - 1) * pageSize, effectivePage * pageSize);

	return (
		<Main isOpen={isOpenPopup === "player-history"} role="complementary" aria-hidden={isOpenPopup !== "player-history"}>
			<Inner style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
				<Header>
					<Title>History</Title>
					<CloseButton type="button" onClick={handleClose} aria-label="Close">
						<FontAwesomeIcon icon={faXmark} />
					</CloseButton>
				</Header>
				<SearchInput
					type="text"
					placeholder="Search..."
					value={search}
					onChange={e => { setSearch(e.target.value); setPage(1); }}
				/>
				<Container ref={containerRef}>
					<TrackList data={visible} />
				</Container>
				<PaginationArea>
					{totalPages > 1 && (
						<>
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
						</>
					)}
				</PaginationArea>
			</Inner>
		</Main>
	)
}

export default PlayerHistory;
