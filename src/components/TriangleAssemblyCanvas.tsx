"use client";

import { useEffect, useRef } from "react";

interface TriangleAssemblyCanvasProps {
  imageSrc: string;
  cols?: number;
  pointerRef?: React.MutableRefObject<{
    nx: number;
    ny: number;
    inside: boolean;
  }>;
}

interface ShardCell {
  row: number;
  col: number;
  pointsUp: boolean;
  p0: [number, number];
  p1: [number, number];
  p2: [number, number];
  cx: number;
  cy: number;
  normX: number;
  normY: number;
  edgeFactor: number;
  delay: number;
  duration: number;
  startDx: number;
  startDy: number;
  startTiltY: number;
  spinDir: number;
  seed: number;
}

const imageCache = new Map<string, HTMLImageElement>();

function getOrLoadImage(src: string, onLoad?: () => void): HTMLImageElement {
  const cached = imageCache.get(src);
  if (cached) {
    if (!cached.complete && onLoad) {
      cached.addEventListener("load", onLoad, { once: true });
    }
    return cached;
  }
  const img = new window.Image();
  img.decoding = "async";
  img.src = src;
  if (onLoad) {
    img.addEventListener("load", onLoad, { once: true });
  }
  imageCache.set(src, img);
  return img;
}

function drawObjectCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const boxRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;
  if (imgRatio > boxRatio) {
    sw = img.naturalHeight * boxRatio;
    sx = (img.naturalWidth - sw) * 0.5;
  } else {
    sh = img.naturalWidth / boxRatio;
    sy = (img.naturalHeight - sh) * 0.5;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
}

function buildEquilateralLattice(width: number, height: number, targetCols: number): ShardCell[] {
  const s = width / Math.max(4, targetCols);
  const h = (s * Math.sqrt(3)) / 2;
  const halfS = s / 2;
  const cols = Math.ceil((width + s) / halfS) + 2;
  const rows = Math.ceil((height + h) / h) + 2;
  const cells: ShardCell[] = [];
  const maxDiag = width + height;

  for (let r = -1; r < rows; r++) {
    const yTop = r * h;
    const yBot = (r + 1) * h;

    for (let c = -2; c < cols; c++) {
      const xBase = c * halfS - (r % 2 === 0 ? 0 : halfS * 0.5);
      const pointsUp = ((r + c) & 1) === 0;

      const p0: [number, number] = pointsUp ? [xBase + halfS, yTop] : [xBase, yTop];
      const p1: [number, number] = pointsUp ? [xBase + s, yBot] : [xBase + s, yTop];
      const p2: [number, number] = pointsUp ? [xBase, yBot] : [xBase + halfS, yBot];

      const cx = (p0[0] + p1[0] + p2[0]) / 3;
      const cy = (p0[1] + p1[1] + p2[1]) / 3;

      if (cx < -s * 0.65 || cx > width + s * 0.65 || cy < -h * 0.65 || cy > height + h * 0.65) {
        continue;
      }

      const normX = Math.max(0, Math.min(1, cx / Math.max(1, width)));
      const normY = Math.max(0, Math.min(1, cy / Math.max(1, height)));
      const distFromCenter = Math.hypot((normX - 0.5) * 1.4, normY - 0.5);

      // 6-triangle hexagonal rosette grouping
      const clusterCol = Math.floor((c + 2) / 3);
      const clusterRow = Math.floor((r + 1) / 2);
      const clusterCx = clusterCol * 1.5 * s;
      const clusterCy = clusterRow * 2 * h;

      const seed = Math.abs(Math.sin(r * 37.13 + c * 91.77));
      const diagonalWave =
        (1 - normX * 0.52 - normY * 0.48) * 0.78 +
        ((clusterCx + clusterCy) / Math.max(1, maxDiag)) * 0.14;

      const delay = Math.max(0.02, diagonalWave * 1.05 + seed * 0.24);
      const duration = 0.72 + seed * 0.24;

      // Incoming bottom-right trajectory echoing HyperFrames shard ribbon
      const startDx = 75 + (1 - normX) * 58 + seed * 90;
      const startDy = 42 + (1 - normY) * 38 + ((seed * 17) % 1) * 76;

      cells.push({
        row: r,
        col: c,
        pointsUp,
        p0,
        p1,
        p2,
        cx,
        cy,
        normX,
        normY,
        edgeFactor: Math.min(1, distFromCenter),
        delay,
        duration,
        startDx,
        startDy,
        startTiltY: 0.75 + seed * 1.4,
        spinDir: seed > 0.5 ? 1 : -1,
        seed,
      });
    }
  }

  cells.sort((a, b) => a.delay - b.delay);
  return cells;
}

function traceRoundedTriangle(
  ctx: CanvasRenderingContext2D,
  pts: ReadonlyArray<[number, number]>,
  radius: number
) {
  ctx.beginPath();
  if (radius <= 0.35) {
    ctx.moveTo(pts[0][0], pts[0][1]);
    ctx.lineTo(pts[1][0], pts[1][1]);
    ctx.lineTo(pts[2][0], pts[2][1]);
    ctx.closePath();
    return;
  }

  for (let i = 0; i < 3; i++) {
    const prev = pts[(i + 2) % 3];
    const curr = pts[i];
    const next = pts[(i + 1) % 3];

    const v1x = prev[0] - curr[0];
    const v1y = prev[1] - curr[1];
    const v2x = next[0] - curr[0];
    const v2y = next[1] - curr[1];
    const len1 = Math.hypot(v1x, v1y) || 1;
    const len2 = Math.hypot(v2x, v2y) || 1;
    const r = Math.min(radius, len1 * 0.28, len2 * 0.28);

    const pStartX = curr[0] + (v1x / len1) * r;
    const pStartY = curr[1] + (v1y / len1) * r;
    const pEndX = curr[0] + (v2x / len2) * r;
    const pEndY = curr[1] + (v2y / len2) * r;

    if (i === 0) ctx.moveTo(pStartX, pStartY);
    else ctx.lineTo(pStartX, pStartY);
    ctx.quadraticCurveTo(curr[0], curr[1], pEndX, pEndY);
  }
  ctx.closePath();
}

export function TriangleAssemblyCanvas({
  imageSrc,
  cols = 9,
  pointerRef,
}: TriangleAssemblyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentImgRef = useRef<HTMLImageElement | null>(null);
  const prevImgRef = useRef<HTMLImageElement | null>(null);
  const transitionStartRef = useRef<number>(performance.now());
  const mountedSrcRef = useRef<string | null>(null);

  useEffect(() => {
    if (mountedSrcRef.current === imageSrc) return;
    const previousImg = currentImgRef.current;
    if (previousImg && previousImg.complete && previousImg.naturalWidth > 0) {
      prevImgRef.current = previousImg;
    }
    mountedSrcRef.current = imageSrc;

    const nextImg = getOrLoadImage(imageSrc, () => {
      transitionStartRef.current = performance.now();
    });
    currentImgRef.current = nextImg;
    if (nextImg.complete && nextImg.naturalWidth > 0) {
      transitionStartRef.current = performance.now();
    }
  }, [imageSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let cells: ShardCell[] = [];
    let maxFinishSec = 1.85;

    const rebuildGrid = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      cells = buildEquilateralLattice(width, height, cols);
      maxFinishSec = cells.reduce((m, c) => Math.max(m, c.delay + c.duration), 1.65);
    };

    rebuildGrid();
    const ro = new ResizeObserver(rebuildGrid);
    ro.observe(canvas);

    const drawFrame = (now: number) => {
      const img = currentImgRef.current;
      const prevImg = prevImgRef.current;

      if (!width || !height || !img || !img.complete || img.naturalWidth === 0) {
        rafId = window.requestAnimationFrame(drawFrame);
        return;
      }

      const elapsed = Math.max(0, (now - transitionStartRef.current) / 1000);
      const globalProgress = Math.min(1, elapsed / (maxFinishSec + 0.12));

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // 1. Seamless base underneath assembling shards:
      //    If switching slides, keep previous photo crisp (ZERO black flash);
      //    On first load, show refined Matte Black + gold hexagonal blueprint fading out cleanly.
      if (prevImg && prevImg.complete && prevImg.naturalWidth > 0 && globalProgress < 1) {
        drawObjectCover(ctx, prevImg, width, height);
      } else if (globalProgress < 1) {
        const backdropAlpha =
          globalProgress < 0.84 ? 1 : Math.max(0, 1 - (globalProgress - 0.84) / 0.16);
        if (backdropAlpha > 0.005) {
          ctx.fillStyle = `rgba(8, 9, 12, ${backdropAlpha.toFixed(3)})`;
          ctx.fillRect(0, 0, width, height);
          ctx.lineWidth = 0.7;
          ctx.strokeStyle = `rgba(252, 170, 48, ${(0.085 * backdropAlpha).toFixed(3)})`;
          for (let i = 0; i < cells.length; i++) {
            const c = cells[i];
            traceRoundedTriangle(ctx, [c.p0, c.p1, c.p2], 0);
            ctx.stroke();
          }
        }
      }

      // 2. When assembled, keep a constant, living optical crystal flow running at 60fps
      if (globalProgress >= 1) {
        drawObjectCover(ctx, img, width, height);

        const timeSec = now / 1000;
        const flowPhase = (timeSec * 0.34) % 1.4; // Sweeps bottom-right -> top-left continuously
        const ptr = pointerRef?.current;
        const px = ptr?.inside ? (ptr.nx * 0.5 + 0.5) * width : -9999;
        const py = ptr?.inside ? (ptr.ny * 0.5 + 0.5) * height : -9999;

        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          const diagPos = 1 - (cell.normX * 0.58 + cell.normY * 0.42);
          const waveDist = Math.abs(diagPos - (flowPhase - 0.2));
          const waveBoost = Math.max(0, 1 - waveDist / 0.2);

          const cursorDist = ptr?.inside ? Math.hypot(cell.cx - px, cell.cy - py) : 9999;
          const cursorBoost = cursorDist < 135 ? 1 - cursorDist / 135 : 0;

          // Subtle edge facet breathing pulse synchronized with the traveling caustic wave
          const pulseStrength = Math.min(1, waveBoost * 0.75 + cursorBoost * 0.95);
          if (pulseStrength > 0.03) {
            const subtleBreath =
              cell.edgeFactor > 0.48 && waveBoost > 0.15
                ? 1 - waveBoost * 0.045 * cell.edgeFactor
                : 1;
            const localPts: [number, number][] = [
              [(cell.p0[0] - cell.cx) * subtleBreath + cell.cx, (cell.p0[1] - cell.cy) * subtleBreath + cell.cy],
              [(cell.p1[0] - cell.cx) * subtleBreath + cell.cx, (cell.p1[1] - cell.cy) * subtleBreath + cell.cy],
              [(cell.p2[0] - cell.cx) * subtleBreath + cell.cx, (cell.p2[1] - cell.cy) * subtleBreath + cell.cy],
            ];

            traceRoundedTriangle(ctx, localPts, subtleBreath < 0.995 ? 3 : 0);

            if (subtleBreath < 0.995) {
              // Subtle floating shard lift along outer frame edges
              ctx.save();
              ctx.clip();
              drawObjectCover(ctx, img, width, height);
              ctx.restore();
            }

            const edgeAlpha = pulseStrength * (0.24 + cell.seed * 0.14);
            ctx.lineWidth = 0.85 + cursorBoost * 0.5;
            ctx.strokeStyle =
              cell.seed > 0.42
                ? `rgba(252, 170, 48, ${edgeAlpha.toFixed(3)})`
                : `rgba(255, 255, 255, ${(edgeAlpha * 0.82).toFixed(3)})`;
            ctx.stroke();

            if (pulseStrength > 0.35) {
              ctx.fillStyle = `rgba(252, 170, 48, ${(pulseStrength * 0.045).toFixed(3)})`;
              ctx.fill();
            }
          }
        }

        ctx.restore();
        rafId = window.requestAnimationFrame(drawFrame);
        return;
      }

      // 3. Active Shard Assembly Choreography (incoming hexagonal triangular pieces snapping into place)
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const rawU = (elapsed - cell.delay) / cell.duration;
        if (rawU <= 0) continue;

        const u = Math.min(1, rawU);
        const inv = 1 - u;
        const ease = 1 - inv * inv * inv * inv;

        const dx = cell.startDx * (1 - ease);
        const dy = cell.startDy * (1 - ease);

        const tiltAngle = cell.startTiltY * (1 - ease);
        const scaleX = Math.max(0.2, Math.abs(Math.cos(tiltAngle)));
        const scaleY = 0.72 + 0.28 * ease;
        const rot = cell.spinDir * 0.34 * (1 - ease);

        const sealPhase = Math.max(0, (u - 0.84) / 0.16);
        const insetScale = 0.92 + 0.085 * sealPhase;
        const cornerR = 5.5 * (1 - sealPhase);

        const localPts: [number, number][] = [
          [(cell.p0[0] - cell.cx) * insetScale, (cell.p0[1] - cell.cy) * insetScale],
          [(cell.p1[0] - cell.cx) * insetScale, (cell.p1[1] - cell.cy) * insetScale],
          [(cell.p2[0] - cell.cx) * insetScale, (cell.p2[1] - cell.cy) * insetScale],
        ];

        ctx.save();
        ctx.translate(cell.cx + dx, cell.cy + dy);

        // Soft 3D elevation drop shadow while airborne
        if (u < 0.96) {
          const lift = (1 - ease) * 14;
          ctx.save();
          ctx.translate(lift * 0.6, lift * 0.85);
          ctx.rotate(rot);
          ctx.scale(scaleX, scaleY);
          traceRoundedTriangle(ctx, localPts, cornerR);
          ctx.fillStyle = `rgba(0, 0, 0, ${(0.55 * (1 - ease)).toFixed(3)})`;
          ctx.fill();
          ctx.restore();
        }

        ctx.rotate(rot);
        ctx.scale(scaleX, scaleY);

        // Extruded dark metallic prism thickness bevel
        if (u < 0.94) {
          ctx.save();
          ctx.translate((1 - ease) * 4.5, (1 - ease) * 5.2);
          traceRoundedTriangle(ctx, localPts, cornerR);
          ctx.fillStyle = cell.seed > 0.5 ? "#17181E" : "#0D0E13";
          ctx.fill();
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = `rgba(252, 170, 48, ${(0.58 * (1 - sealPhase)).toFixed(3)})`;
          ctx.stroke();
          ctx.restore();
        }

        // Clipped triangular EV photo tile
        ctx.save();
        traceRoundedTriangle(ctx, localPts, cornerR);
        ctx.clip();

        const photoReveal = Math.min(1, Math.max(0, (u - 0.12) / 0.48));
        if (photoReveal < 1) {
          ctx.fillStyle = "#0D0F15";
          ctx.fillRect(-width, -height, width * 2, height * 2);
        }

        if (photoReveal > 0.01) {
          ctx.globalAlpha = photoReveal;
          ctx.translate(-cell.cx, -cell.cy);
          drawObjectCover(ctx, img, width, height);
          ctx.globalAlpha = 1;
        }
        ctx.restore();

        // Gold & Chrome optical bevel highlight
        if (u < 0.98) {
          const rimAlpha = u < 0.7 ? 0.7 : 0.7 * (1 - (u - 0.7) / 0.28);
          traceRoundedTriangle(ctx, localPts, cornerR);
          ctx.lineWidth = 1.15;
          ctx.strokeStyle =
            cell.seed > 0.35
              ? `rgba(255, 255, 255, ${(rimAlpha * 0.75).toFixed(3)})`
              : `rgba(252, 170, 48, ${(rimAlpha * 0.92).toFixed(3)})`;
          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore();
      rafId = window.requestAnimationFrame(drawFrame);
    };

    rafId = window.requestAnimationFrame(drawFrame);
    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [cols, pointerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[15] h-full w-full"
    />
  );
}
