export type Track = {
  id: string | null;
  url: string;
  title: string;
  duration: number; // seconds
};

export type QueueState = {
  nowPlaying: null | { track: Track };
  queued: Array<{ position: number; track: Track; addedAt: number }>;
  listeners: number;
  playing: boolean;
  paused: boolean;
  positionSeconds: number;
  serverTimeMs: number;
};

export type HelloPayload = QueueState;
export type ProgressPayload = QueueState;

export type EnqueueAck =
  | { ok: true; position: number; nowPlaying: QueueState["nowPlaying"]; track: Track }
  | { ok: false; error: string };

export type SimpleAck = { ok: true } | { ok: false; error: string };

