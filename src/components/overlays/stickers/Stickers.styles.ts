import { styled } from "@mui/material";

// ─── StickerStage ────────────────────────────────────────────────────────────

export const Stage = styled("div") <{ interactive: boolean }>`
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: 4;
  pointer-events: none;
  touch-action: none;

  ${({ interactive }) =>
    interactive &&
    `
    pointer-events: auto;
  `}
`;

export const BackgroundLayer = styled("div")`
  position: absolute;
  inset: 0;
  z-index: 0;
`;

export const BackgroundImage = styled("img") <{ editingOriginal?: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  user-select: none;
  pointer-events: none;

  ${({ editingOriginal }) => editingOriginal && `opacity: 0.35;`}
`;

export const StageItem = styled("img") <{ isDraft?: boolean; editingOriginal?: boolean }>`
  position: absolute;
  user-select: none;
  pointer-events: none;
  will-change: transform, width, height;

  ${({ isDraft }) =>
    isDraft &&
    `
    pointer-events: auto;
    cursor: grab;
    box-shadow: 0 14px 42px rgba(45, 212, 191, 0.28);
    outline: 1px solid rgba(45, 212, 191, 0.35);
  `}

  ${({ editingOriginal }) => editingOriginal && `opacity: 0.35;`}
`;

export const EditorBox = styled("div")`
  position: absolute;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(45, 212, 191, 0.7);
  box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.12);
  pointer-events: auto;
  z-index: 2;
`;

const handlePositionStyles: Record<string, string> = {
  nw: "left: -6px; top: -6px; cursor: nwse-resize;",
  ne: "right: -6px; top: -6px; cursor: nesw-resize;",
  sw: "left: -6px; bottom: -6px; cursor: nesw-resize;",
  se: "right: -6px; bottom: -6px; cursor: nwse-resize;",
  w: "left: -6px; top: 50%; transform: translateY(-50%); cursor: ew-resize;",
  e: "right: -6px; top: 50%; transform: translateY(-50%); cursor: ew-resize;",
  n: "left: 50%; top: -6px; transform: translateX(-50%); cursor: ns-resize;",
  s: "left: 50%; bottom: -6px; transform: translateX(-50%); cursor: ns-resize;",
};

export const EditorHandle = styled("div") <{ dir: string }>`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: var(--card);
  border: 1px solid rgba(45, 212, 191, 0.7);

  ${({ dir }) => handlePositionStyles[dir] ?? ""}
`;

export const RotateHandle = styled("div")`
  position: absolute;
  left: 50%;
  top: -26px;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: rgba(45, 212, 191, 0.2);
  border: 1px solid rgba(45, 212, 191, 0.7);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

// ─── StickerListItem ─────────────────────────────────────────────────────────

export const StickerCard = styled("div")`
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--card);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StickerCardMain = styled("button")`
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  width: 100%;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const StickerCardThumb = styled("div")`
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
`;

export const StickerLabelBadges = styled("div")`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 5;
  pointer-events: none;
`;

export const StickerLabelBadge = styled("div")`
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(2, 6, 23, 0.55);
  color: var(--accent-2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StickerCardImg = styled("img")`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 8px;
  pointer-events: none;
`;

export const StickerCardActions = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const StickerCardCoords = styled("div")`
  font-size: 12px;
  color: var(--muted);
  opacity: 0.95;
`;

export const StickerCardBinding = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const StickerCardBindingTitle = styled("div")`
  font-size: 12px;
  color: var(--muted);
  opacity: 0.95;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }
`;

export const StickerCardBindingInfoIcon = styled("span")`
  flex: 0 0 auto;
`;

// ─── StickersList (StickersOverlay) ─────────────────────────────────────────

export const StickersList = styled("div")`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding-top: 12px;
  padding-bottom: 12px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr 1fr;
  }
`;

// ─── UploadSection ───────────────────────────────────────────────────────────

export const UploadDropzone = styled("div") <{ active?: boolean }>`
  border-radius: 16px;
  border: 2px dashed rgba(148, 163, 184, 0.65);
  background: rgba(20, 184, 166, 0.08);
  padding: 16px 16px 14px;

  ${({ active }) =>
    active &&
    `
    border-color: rgba(45, 212, 191, 0.85);
    box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.14);
  `}
`;

export const UploadTitle = styled("div")`
  font-weight: 800;
  margin-bottom: 6px;
`;

export const UploadHint = styled("div")`
  color: var(--muted);
  margin-bottom: 14px;
`;

export const UploadControls = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const UploadError = styled("div")`
  margin-top: 10px;
  color: #fecaca;
  font-weight: 600;
`;

export const UploadLoading = styled("div")`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-weight: 600;
`;

export const UploadHr = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px 0;
  color: var(--muted);

  &::before,
  &::after {
    content: "";
    border-top: 1px solid var(--muted);
    width: 50px;
  }
`;

export const UploadLink = styled("form")`
  display: flex;
  gap: 16px;
`;

export const BindCheckbox = styled("label")`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  margin-bottom: 14px;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: rgba(45, 212, 191, 0.95);
  }

  span {
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
  }

  &:has(input:disabled) {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

// ─── DraftBottomBar ──────────────────────────────────────────────────────────

export const BottomActions = styled("div")`
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  z-index: 22;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: auto;
`;

export const BottomBindRow = styled("div")`
  display: flex;
  justify-content: center;
  flex-direction: column-reverse;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: rgba(2, 6, 23, 0.55);
`;

export const BottomBindCheckbox = styled("label")`
  display: flex;
  align-items: center;
  gap: 10px;
  user-select: none;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: rgba(45, 212, 191, 0.95);
  }

  span {
    font-weight: 800;
    font-size: 13px;
  }
`;

export const BottomBindMeta = styled("div")`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  white-space: nowrap;
`;

export const BottomBtnRow = styled("div")`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const BottomZIndexRow = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: rgba(2, 6, 23, 0.55);
`;

export const BottomBGRow = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: rgba(2, 6, 23, 0.55);
`;

export const BottomZIndexLabel = styled("div")`
  font-weight: 900;
  font-size: 13px;
  color: var(--text);
  white-space: nowrap;
`;
