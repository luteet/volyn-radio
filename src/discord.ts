import { DiscordSDK } from "@discord/embedded-app-sdk";

export type DiscordInitState =
  | { status: "not_in_discord" }
  | { status: "connecting" }
  | { status: "connected"; sdk: DiscordSDK };

export function isRunningInDiscord(): boolean {
  // Discord Activity runs inside an iframe and provides a `frame_id` query param.
  const params = new URLSearchParams(window.location.search);
  return params.has("frame_id");
}

export async function initDiscord(): Promise<DiscordInitState> {
  if (!isRunningInDiscord()) return { status: "not_in_discord" };

  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID as string | undefined;
  if (!clientId) {
    // We are in Discord, but missing client id configuration.
    return { status: "not_in_discord" };
  }

  const sdk = new DiscordSDK(clientId);
  await sdk.ready();
  return { status: "connected", sdk };
}

