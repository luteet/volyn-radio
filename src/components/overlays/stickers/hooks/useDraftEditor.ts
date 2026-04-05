import { useRef } from "react";
import type { DraftSticker } from "../../../../types/stickers";

export type ResizeDir = "n" | "s" | "e" | "w" | "nw" | "ne" | "sw" | "se";

export type EditorSession =
  | {
      mode: "resize";
      dir: ResizeDir;
      startClientX: number;
      startClientY: number;
      startCenterXPx: number;
      startCenterYPx: number;
      startWPx: number;
      startHPx: number;
      stageW: number;
      stageH: number;
      startRotationDeg: number;
    }
  | {
      mode: "rotate";
      startClientX: number;
      startClientY: number;
      startCenterXPx: number;
      startCenterYPx: number;
      stageW: number;
      stageH: number;
      startRotationDeg: number;
      startAngleDeg: number;
    };

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function resolvedWPx(d: DraftSticker, stageW: number) {
  const wPct = typeof d.wPct === "number" && Number.isFinite(d.wPct) ? d.wPct : 300 / stageW;
  return wPct * stageW;
}

function resolvedHPx(d: DraftSticker, stageH: number) {
  const hPct = typeof d.hPct === "number" && Number.isFinite(d.hPct) ? d.hPct : 300 / stageH;
  return hPct * stageH;
}

type Params = {
  draft: DraftSticker | null;
  isDraftBackground: boolean;
  isUploading: boolean;
  stageRef: React.RefObject<HTMLDivElement | null>;
  setDraft: React.Dispatch<React.SetStateAction<DraftSticker | null>>;
};

export function useDraftEditor({ draft, isDraftBackground, isUploading, stageRef, setDraft }: Params) {
  const editorSessionRef = useRef<EditorSession | null>(null);

  function onDraftPointerDown(e: React.PointerEvent<HTMLImageElement>) {
    if (!draft || isUploading || isDraftBackground || editorSessionRef.current) return;
    e.preventDefault();

    const el = stageRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + draft.xPct * rect.width);
    const offsetY = e.clientY - (rect.top + draft.yPct * rect.height);

    const onMove = (ev: PointerEvent) => {
      setDraft((d) =>
        d
          ? {
              ...d,
              xPct: clamp01((ev.clientX - rect.left - offsetX) / rect.width),
              yPct: clamp01((ev.clientY - rect.top - offsetY) / rect.height),
            }
          : d
      );
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  }

  function onEditorBoxPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!draft || isUploading || isDraftBackground || editorSessionRef.current) return;

    const target = e.target as HTMLElement | null;
    if (target?.closest(".stickersEditorHandle") || target?.closest(".stickersRotateHandle"))
      return;

    e.preventDefault();
    e.stopPropagation();

    const el = stageRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + draft.xPct * rect.width);
    const offsetY = e.clientY - (rect.top + draft.yPct * rect.height);

    const onMove = (ev: PointerEvent) => {
      setDraft((d) =>
        d
          ? {
              ...d,
              xPct: clamp01((ev.clientX - rect.left - offsetX) / rect.width),
              yPct: clamp01((ev.clientY - rect.top - offsetY) / rect.height),
            }
          : d
      );
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  }

  function onResizeHandlePointerDown(e: React.PointerEvent, dir: ResizeDir) {
    if (!draft || isDraftBackground || !stageRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const rect = stageRef.current.getBoundingClientRect();
    const stageW = Math.max(1, rect.width);
    const stageH = Math.max(1, rect.height);

    editorSessionRef.current = {
      mode: "resize",
      dir,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startCenterXPx: draft.xPct * stageW,
      startCenterYPx: draft.yPct * stageH,
      startWPx: resolvedWPx(draft, stageW),
      startHPx: resolvedHPx(draft, stageH),
      stageW,
      stageH,
      startRotationDeg: Number.isFinite(draft.rotationDeg) ? draft.rotationDeg : 0,
    };

    const onMove = (ev: PointerEvent) => {
      const s = editorSessionRef.current;
      if (!s || s.mode !== "resize") return;

      const dx = ev.clientX - s.startClientX;
      const dy = ev.clientY - s.startClientY;
      const minPx = 20;

      let w = s.startWPx;
      let h = s.startHPx;
      let cx = s.startCenterXPx;
      let cy = s.startCenterYPx;

      if (s.dir.includes("w")) {
        const right = s.startCenterXPx + s.startWPx / 2;
        w = Math.max(minPx, Math.min(s.stageW, right - (s.startCenterXPx - s.startWPx / 2 + dx)));
        cx = (right - w + right) / 2;
      } else if (s.dir.includes("e")) {
        const left = s.startCenterXPx - s.startWPx / 2;
        w = Math.max(minPx, Math.min(s.stageW, s.startCenterXPx + s.startWPx / 2 + dx - left));
        cx = (left + left + w) / 2;
      }

      if (s.dir.includes("n")) {
        const bottom = s.startCenterYPx + s.startHPx / 2;
        h = Math.max(minPx, Math.min(s.stageH, bottom - (s.startCenterYPx - s.startHPx / 2 + dy)));
        cy = (bottom - h + bottom) / 2;
      } else if (s.dir.includes("s")) {
        const top = s.startCenterYPx - s.startHPx / 2;
        h = Math.max(minPx, Math.min(s.stageH, s.startCenterYPx + s.startHPx / 2 + dy - top));
        cy = (top + top + h) / 2;
      }

      setDraft((d) => {
        if (!d || d.id !== draft.id) return d;
        return {
          ...d,
          xPct: clamp01(cx / s.stageW),
          yPct: clamp01(cy / s.stageH),
          wPct: Math.max(0, Math.min(1, w / s.stageW)),
          hPct: Math.max(0, Math.min(1, h / s.stageH)),
        };
      });
    };

    const onUp = () => {
      editorSessionRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function onRotateHandlePointerDown(e: React.PointerEvent) {
    if (!draft || isDraftBackground || !stageRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const rect = stageRef.current.getBoundingClientRect();
    const stageW = Math.max(1, rect.width);
    const stageH = Math.max(1, rect.height);
    const centerXPx = draft.xPct * stageW;
    const centerYPx = draft.yPct * stageH;

    editorSessionRef.current = {
      mode: "rotate",
      startClientX: e.clientX,
      startClientY: e.clientY,
      startCenterXPx: centerXPx,
      startCenterYPx: centerYPx,
      stageW,
      stageH,
      startRotationDeg: Number.isFinite(draft.rotationDeg) ? draft.rotationDeg : 0,
      startAngleDeg:
        (Math.atan2(e.clientY - centerYPx, e.clientX - centerXPx) * 180) / Math.PI,
    };

    const onMove = (ev: PointerEvent) => {
      const s = editorSessionRef.current;
      if (!s || s.mode !== "rotate") return;
      const angle =
        (Math.atan2(ev.clientY - s.startCenterYPx, ev.clientX - s.startCenterXPx) * 180) /
        Math.PI;
      setDraft((d) => {
        if (!d || d.id !== draft.id) return d;
        return { ...d, rotationDeg: s.startRotationDeg + (angle - s.startAngleDeg) };
      });
    };

    const onUp = () => {
      editorSessionRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return {
    onDraftPointerDown,
    onEditorBoxPointerDown,
    onResizeHandlePointerDown,
    onRotateHandlePointerDown,
  };
}
