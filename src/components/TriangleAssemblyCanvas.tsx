"use client";

import { useEffect, useRef } from "react";

interface TriangleAssemblyCanvasProps {
  imageSrc: string;
  sceneKey: string | number;
  cols?: number;
  pointerRef?: React.MutableRefObject<{
    nx: number;
    ny: number;
    inside: boolean;
  }>;
  showAmbientShards?: boolean;
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
  delay: number;
  duration: number;
  startDx: number;
  startDy: number;
  startTiltX: number;
  startTiltY: number;
  spinDir: number;
  bevelSeed: number;
}

const imageCache = new Map<string, HTMLImageElement>();

function getOrLoadImage(src: string, onLoad: () => void): HTMLImageElement {
  const cached = imageCache.get(src);
  if (cached) {
    if (!cached.complete) {
      cached.addEventListener("load", onLoad, { once: true });
    }
    return cached;
  }
  const img = new window.Image();
  img.decoding = "async";
  img.src = src;
  img.addEventListener("load", onLoad, { once: true });
  imageCache.set(src, img);
  return img;
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

      const p0: [number, number] = pointsUp
        ? [xBase + halfS, yTop]
        : [xBase, yTop];
      const p1: [number, number] = pointsUp
        ? [xBase + s, yBot]
        : [xBase + s, yTop];
      const p2: [number, number] = pointsUp
        ? [xBase, yBot]
        : [xBase + halfS, yBot];

      const cx = (p0[0] + p1[0] + p2[0]) / 3;
      const cy = (p0[1] + p1[1] + p2[1]) / 3;

      if (cx < -s * 0.65 || cx > width + s * 0.65 || cy < -h * 0.65 || cy > height + h * 0.65) {
        continue;
      }

      // Group adjacent triangles into 6-shard hexagonal rosette clusters
      const clusterCol = Math.floor((c + 2) / 3);
      const clusterRow = Math.floor((r + 1) / 2);
      const clusterCx = clusterCol * 1.5 * s;
      const clusterCy = clusterRow * 2 * h;

      // Assembly sweeps diagonally from upper-left/center-right to lock across the frame
      // while trailing entry shards glide in from bottom-right like HyperFrames
      const normX = Math.max(0, Math.min(1, cx / Math.max(1, width)));
      const normY = Math.max(0, Math.min(1, cy / Math.max(1, height)));
      const clusterWave =
        (1 - normX * 0.55 - normY * 0.45) * 0.72 +
        ((clusterCx + clusterCy) / Math.max(1, maxDiag)) * 0.14;
      const seed = Math.abs(Math.sin(r * 37.13 + c * 91.77));
      const shardJitter = seed * 0.28;

      const delay = Math.max(0.03, clusterWave * 1.05 + shardJitter * 0.35);
      const duration = 0.68 + seed * 0.28;

      // Flying entry vector: bottom-right and depth offset
      const startDx = 70 + (1 - normX) * 55 + seed * 85;
      const startDy = 40 + (1 - normY) * 35 + ((seed * 17) % 1) * 75;

      cells.push({
        row: r,
        col: c,
        pointsUp,
        p0,
        p1,
        p2,
        cx,
        cy,
        delay,
        duration,
        startDx,
        startDy,
        startTiltX: (seed - 0.5) * 2.2,
        startTiltY: 0.7 + seed * 1.35,
        spinDir: seed > 0.5 ? 1 : -1,
        bevelSeed: seed,
      });
    }
  }

  // Paint upstream floating shards above locked ones
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

    if (i === 0) {
      ctx.moveTo(pStartX, pStartY);
    } else {
      ctx.lineTo(pStartX, pStartY);
    }
    ctx.quadraticCurveTo(curr[0], curr[1], pEndX, pEndY);
  }
  ctx.closePath();
}

export function TriangleAssemblyCanvas({
  imageSrc,
  sceneKey,
  cols = 8,
  pointerRef,
}: TriangleAssemblyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    let maxFinishSec = 1.9;
    let startTime = performance.now();

    const rebuildGrid = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      cells = buildEquilateralLattice(width, height, cols);
      maxFinishSec = cells.reduce((m, c) => Math.max(m, c.delay + c.duration), 1.6);
    };

    const img = getOrLoadImage(imageSrc, () => {
      startTime = performance.now();
    });
    if (img.complete) {
      startTime = performance.now();
    }

    rebuildGrid();
    const ro = new ResizeObserver(rebuildGrid);
    ro.observe(canvas);

    const drawFrame = (now: number) => {
      if (!width || !height || !img.complete || img.naturalWidth === 0) {
        rafId = window.requestAnimationFrame(drawFrame);
        return;
      }

      const elapsed = (now - startTime) / 1000;
      const globalProgress = Math.min(1, elapsed / (maxFinishSec + 0.18));

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Compute exact CSS object-cover crop so UV slices match <Image> 1:1
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

      // Matte Black base under assembling shards, smoothly fading once locked
      const backdropAlpha =
        globalProgress < 0.85 ? 1 : Math.max(0, 1 - (globalProgress - 0.85) / 0.15);
      if (backdropAlpha > 0.005) {
        ctx.fillStyle = `rgba(9, 10, 13, ${backdropAlpha.toFixed(3)})`;
        ctx.fillRect(0, 0, width, height);

        // Subtle gold/chrome blueprint hairline lattice waiting for shards
        ctx.lineWidth = 0.65;
        ctx.strokeStyle = `rgba(252, 170, 48, ${(0.075 * backdropAlpha).toFixed(3)})`;
        for (let i = 0; i < cells.length; i++) {
          const c = cells[i];
          traceRoundedTriangle(ctx, [c.p0, c.p1, c.p2], 0);
          ctx.stroke();
        }
      }

      // After assembly completes, optionally cast subtle pointer-reactive facet sheen without obscuring image
      if (globalProgress >= 1) {
        const ptr = pointerRef?.current;
        if (ptr?.inside) {
          const px = (ptr.nx * 0.5 + 0.5) * width;
          const py = (ptr.ny * 0.5 + 0.5) * height;
          for (let i = 0; i < cells.length; i++) {
            const c = cells[i];
            const dist = Math.hypot(c.cx - px, c.cy - py);
            if (dist < 130) {
              const strength = (1 - dist / 130) * 0.16;
              traceRoundedTriangle(ctx, [c.p0, c.p1, c.p2], 2);
              ctx.strokeStyle = `rgba(252, 170, 48, ${(strength * 1.4).toFixed(3)})`;
              ctx.lineWidth = 1;
              ctx.stroke();
              ctx.fillStyle = `rgba(255, 255, 255, ${(strength * 0.25).toFixed(3)})`;
              ctx.fill();
            }
          }
        }
        ctx.restore();
        rafId = window.requestAnimationFrame(drawFrame);
        return;
      }

      // Render each triangular shard in assembly choreography
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const rawU = (elapsed - cell.delay) / cell.duration;
        if (rawU <= 0) continue;

        const u = Math.min(1, rawU);
        // Smooth quintic ease-out
        const inv = 1 - u;
        const ease = 1 - inv * inv * inv * inv;

        // Triangle displacement from floating 3D origin into locked spot
        const dx = cell.startDx * (1 - ease);
        const dy = cell.startDy * (1 - ease);

        // 3D prism foreshortening tilt & rotation collapsing cleanly to 0
        const tiltAngle = cell.startTiltY * (1 - ease);
        const scaleX = Math.max(0.18, Math.abs(Math.cos(tiltAngle)));
        const scaleY = 0.72 + 0.28 * ease;
        const rot = cell.spinDir * 0.36 * (1 - ease);

        // Rounded corner prism inset while floating -> seamless seal on lock
        const sealPhase = Math.max(0, (u - 0.84) / 0.16);
        const insetScale = 0.925 + 0.08 * sealPhase;
        const cornerR = 5.5 * (1 - sealPhase);

        const localPts: [number, number][] = [
          [(cell.p0[0] - cell.cx) * insetScale, (cell.p0[1] - cell.cy) * insetScale],
          [(cell.p1[0] - cell.cx) * insetScale, (cell.p1[1] - cell.cy) * insetScale],
          [(cell.p2[0] - cell.cx) * insetScale, (cell.p2[1] - cell.cy) * insetScale],
        ];

        ctx.save();
        ctx.translate(cell.cx + dx, cell.cy + dy);

        // Simulated 3D beveled prism shadow underneath airborne shards
        if (u < 0.96) {
          const lift = (1 - ease) * 14;
          ctx.save();
          ctx.translate(lift * 0.65, lift * 0.9);
          ctx.rotate(rot);
          ctx.scale(scaleX, scaleY);
          traceRoundedTriangle(ctx, localPts, cornerR);
          ctx.fillStyle = `rgba(0, 0, 0, ${(0.55 * (1 - ease)).toFixed(3)})`;
          ctx.fill();
          ctx.restore();
        }

        ctx.rotate(rot);
        ctx.scale(scaleX, scaleY);

        // Extruded dark metallic bevel rim thickness while tilted (HyperFrames prism look)
        if (u < 0.94) {
          ctx.save();
          ctx.translate((1 - ease) * 4.5, (1 - ease) * 5.5);
          traceRoundedTriangle(ctx, localPts, cornerR);
          ctx.fillStyle = cell.bevelSeed > 0.5 ? "#17181E" : "#0D0E13";
          ctx.fill();
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = `rgba(252, 170, 48, ${(0.55 * (1 - sealPhase)).toFixed(3)})`;
          ctx.stroke();
          ctx.restore();
        }

        // Main clipped rounded triangle face
        ctx.save();
        traceRoundedTriangle(ctx, localPts, cornerR);
        ctx.clip();

        // Dark obsidian tile face during early tumble -> crossfades cleanly into crisp EV photo
        const photoReveal = Math.min(1, Math.max(0, (u - 0.14) / 0.52));
        if (photoReveal < 1) {
          ctx.fillStyle = "#0F1117";
          ctx.fillRect(-width, -height, width * 2, height * 2);
        }

        if (photoReveal > 0.01) {
          ctx.globalAlpha = photoReveal;
          // Keep the EV image slice locked onto the tumbling 3D shard face
          ctx.translate(-cell.cx, -cell.cy);
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
          ctx.globalAlpha = 1;
        }
        ctx.restore();

        // Crisp optical glass/gold rim specular glint around assembling shards
        if (u < 0.98) {
          const rimAlpha = u < 0.7 ? 0.65 : 0.65 * (1 - (u - 0.7) / 0.28);
          traceRoundedTriangle(ctx, localPts, cornerR);
          ctx.lineWidth = 1.15;
          ctx.strokeStyle =
            cell.bevelSeed > 0.35
              ? `rgba(255, 255, 255, ${(rimAlpha * 0.75).toFixed(3)})`
              : `rgba(252, 170, 48, ${(rimAlpha * 0.9).toFixed(3)})`;
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
  }, [imageSrc, sceneKey, cols, pointerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[15] h-full w-full"
    />
  );
}
