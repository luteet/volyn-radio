import { useEffect, useRef, useState, type FC } from "react";

interface Props {
  src: string;
  alt?: string;
  draggable?: boolean;
}

const CANVAS_SIZE = 300;

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement): void {
  const size = CANVAS_SIZE;
  const imgAspect = img.naturalWidth / img.naturalHeight;

  let sx: number, sy: number, sw: number, sh: number;
  if (imgAspect > 1) {
    sh = img.naturalHeight;
    sw = sh;
    sx = (img.naturalWidth - sw) / 2;
    sy = 0;
  } else {
    sw = img.naturalWidth;
    sh = sw;
    sx = 0;
    sy = (img.naturalHeight - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, size, size);
}

export const StickerThumb: FC<Props> = ({ src, alt = "", draggable = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);
  const [thumbSrc, setThumbSrc] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      drawCover(ctx, img);
      setThumbSrc(src);
    };
    img.src = src;
  }, [src]);

  const showCanvas = thumbSrc === src && !hovered;

  return (
    <div
      style={{ width: "100%", height: "100%", position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          pointerEvents: "none",
          display: showCanvas ? "block" : "none",
        }}
      />
      <img
        src={src}
        alt={alt}
        draggable={draggable}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "8px",
          pointerEvents: "none",
          display: !showCanvas ? "block" : "none",
        }}
      />
    </div>
  );
};
