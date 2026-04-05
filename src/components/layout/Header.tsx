import { Badge } from "../ui/Badge";
import { useAppStore, type SocketStatus } from "../../store/appStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faUser, faWifi } from "@fortawesome/free-solid-svg-icons";
import type { ReactNode } from "react";
import Spinner from "../ui/Spinner";
import { usePlayerStore } from "../../store/playerStore";
import * as PanelStyles from "../overlays/styles/AsidePanel.styles";
import * as BadgeStyles from "../ui/styles/Badge.styles";

const status: Record<SocketStatus, ReactNode> = {
	"connected": <FontAwesomeIcon icon={faCheck} />,
	"connecting": <Spinner />,
	"disconnected": <FontAwesomeIcon icon={faTimes} />,
}

export function Header() {
	const listeners = usePlayerStore((s) => s.queue?.listeners ?? "—");
	const isLive = usePlayerStore((s) => Boolean(s.queue?.playing));
	const socketStatus = useAppStore((s) => s.socketStatus);
	//const discord = useAppStore((s) => s.discord);

	return (
		<PanelStyles.Header>
			<PanelStyles.Title>
				Player
			</PanelStyles.Title>
			<BadgeStyles.Row>
				<Badge>{isLive ? "Live" : "Idle"}</Badge>
				<Badge><FontAwesomeIcon icon={faUser} /> {listeners}</Badge>
				<Badge><FontAwesomeIcon icon={faWifi} /> {status[socketStatus]}</Badge>
				{/* <Badge>
          Discord:{" "}
          {discord.status === "connected"
            ? "connected"
            : discord.status === "connecting"
              ? "…"
              : "no"}
        </Badge> */}
			</BadgeStyles.Row>
		</PanelStyles.Header>
	);
}

