import { useEffect, useState } from "react";
import { initDiscord, type DiscordInitState } from "../discord";

export function useDiscord() {
  const [discord, setDiscord] = useState<DiscordInitState>({ status: "connecting" });

  useEffect(() => {
    void initDiscord()
      .then((st) => setDiscord(st))
      .catch(() => setDiscord({ status: "not_in_discord" }));
  }, []);

  return discord;
}

