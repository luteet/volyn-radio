export type Sticker = {
  id: string;
  filename: string;
  // Center point normalized to [0..1]
  xPct: number;
  yPct: number;

  // Size normalized to [0..1] relative to stage (viewport)
  // Width/height represent the element's unrotated box.
  wPct?: number | null;
  hPct?: number | null;

  // Rotation in degrees around center
  rotationDeg?: number | null;

  // Binding to currently playing track
  trackUrl?: string | null;
  trackTitle?: string | null;

  // Layer order for rendering above/below other stickers
  zIndex?: number | null;

  // Sticker type labels (extensible)
  labels?: string[] | null;
  createdAt?: number;
};

export type DraftSticker = {
  id: string;
  filename: string;
  xPct: number;
  yPct: number;

  wPct?: number | null;
  hPct?: number | null;
  rotationDeg?: number | null;

  trackUrl?: string | null;
  trackTitle?: string | null;

  zIndex?: number | null;

  labels?: string[] | null;
};
