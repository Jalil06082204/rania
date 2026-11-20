import React, { useEffect, useRef } from 'react';

export type AmbientAuroraMode = 'gate' | 'focus' | 'rest' | 'sanctuary';

interface AmbientAuroraProps {
  mode: AmbientAuroraMode;
}

interface PaletteTarget {
  bgTop: [number, number, number];
  bgBottom: [number, number, number];
  orb1: [number, number, number, number]; // rose petal
  orb2: [number, number, number, number]; // champagne cream
  orb3: [number, number, number, number]; // dusty blush
  orb4: [number, number, number, number]; // warm honey/peach-ivory
}

const MODE_PALETTES: Record<AmbientAuroraMode, PaletteTarget> = {
  // Passphrase Gate: luminous rose-quartz & warm petal pearl
  gate: {
    bgTop: [255, 249, 246],
    bgBottom: [251, 241, 238],
    orb1: [244, 214, 223, 0.72],
    orb2: [243, 233, 221, 0.80],
    orb3: [232, 162, 181, 0.34],
    orb4: [250, 228, 218, 0.56],
  },
  // Focus Mode (Study Space / Cardio / Pomodoro Focus): clear champagne-cream & soft pearl rose
  focus: {
    bgTop: [255, 250, 246],
    bgBottom: [249, 243, 236],
    orb1: [243, 231, 218, 0.78],
    orb2: [244, 221, 227, 0.52],
    orb3: [232, 174, 188, 0.24],
    orb4: [252, 240, 226, 0.68],
  },
  // Rest Mode (Breaks / Breathing / Love Letters / Things I Love / Little Garden): deeper soothing dusty rose & warm dusk cream
  rest: {
    bgTop: [254, 246, 244],
    bgBottom: [247, 232, 232],
    orb1: [242, 206, 217, 0.76],
    orb2: [236, 176, 194, 0.36],
    orb3: [243, 227, 214, 0.74],
    orb4: [246, 217, 221, 0.58],
  },
  // Sanctuary Home & Settings: balanced ivory-cream & rose-petal harmony
  sanctuary: {
    bgTop: [255, 249, 246],
    bgBottom: [250, 240, 236],
    orb1: [244, 219, 226, 0.68],
    orb2: [243, 233, 221, 0.78],
    orb3: [232, 162, 181, 0.28],
    orb4: [251, 234, 225, 0.56],
  },
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpTuple<T extends number[]>(current: T, target: T, t: number): T {
  return current.map((v, i) => lerp(v, target[i], t)) as T;
}

/**
 * Living warm rose-petal, champagne-cream, and soft blush ambient aurora layer,
 * paired with a global cursor/touch specular sheen tracker for glass cards.
 */
export const AmbientAurora: React.FC<AmbientAuroraProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modeRef = useRef<AmbientAuroraMode>(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // 1. Living Ambient Mesh / Aurora Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let lastDrawTime = 0;

    // Start with the initial target palette
    const initial = MODE_PALETTES[modeRef.current];
    const currentPalette: PaletteTarget = {
      bgTop: [...initial.bgTop],
      bgBottom: [...initial.bgBottom],
      orb1: [...initial.orb1],
      orb2: [...initial.orb2],
      orb3: [...initial.orb3],
      orb4: [...initial.orb4],
    };

    const resize = () => {
      // Render at gentle half-resolution for silky blurred organic gradients & minimal CPU cost
      const scale = 0.5;
      width = Math.max(320, Math.floor(window.innerWidth * scale));
      height = Math.max(240, Math.floor(window.innerHeight * scale));
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    window.addEventListener('resize', resize);

    const drawFrame = (now: number) => {
      if (!prefersReducedMotion) {
        rafId = window.requestAnimationFrame(drawFrame);
      }

      // Throttle to ~30fps so battery and CPU stay whisper-quiet
      if (!prefersReducedMotion && now - lastDrawTime < 32) {
        return;
      }
      lastDrawTime = now;

      const target = MODE_PALETTES[modeRef.current];
      const blendRate = prefersReducedMotion ? 1 : 0.035;

      currentPalette.bgTop = lerpTuple(currentPalette.bgTop, target.bgTop, blendRate);
      currentPalette.bgBottom = lerpTuple(currentPalette.bgBottom, target.bgBottom, blendRate);
      currentPalette.orb1 = lerpTuple(currentPalette.orb1, target.orb1, blendRate);
      currentPalette.orb2 = lerpTuple(currentPalette.orb2, target.orb2, blendRate);
      currentPalette.orb3 = lerpTuple(currentPalette.orb3, target.orb3, blendRate);
      currentPalette.orb4 = lerpTuple(currentPalette.orb4, target.orb4, blendRate);

      // Base warm ivory-to-blush vertical wash
      const baseGrad = ctx.createLinearGradient(0, 0, width * 0.4, height);
      baseGrad.addColorStop(
        0,
        `rgb(${Math.round(currentPalette.bgTop[0])}, ${Math.round(currentPalette.bgTop[1])}, ${Math.round(currentPalette.bgTop[2])})`
      );
      baseGrad.addColorStop(
        1,
        `rgb(${Math.round(currentPalette.bgBottom[0])}, ${Math.round(currentPalette.bgBottom[1])}, ${Math.round(currentPalette.bgBottom[2])})`
      );
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      const t = prefersReducedMotion ? 0 : now * 0.00018;
      const maxDim = Math.max(width, height);

      const drawOrb = (
        cx: number,
        cy: number,
        radius: number,
        rgba: [number, number, number, number]
      ) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        const r = Math.round(rgba[0]);
        const gCol = Math.round(rgba[1]);
        const b = Math.round(rgba[2]);
        const a = rgba[3];
        g.addColorStop(0, `rgba(${r}, ${gCol}, ${b}, ${a.toFixed(3)})`);
        g.addColorStop(0.5, `rgba(${r}, ${gCol}, ${b}, ${(a * 0.42).toFixed(3)})`);
        g.addColorStop(1, `rgba(${r}, ${gCol}, ${b}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      };

      // 4 softly drifting botanical rose-quartz & champagne orbs
      drawOrb(
        width * (0.16 + Math.sin(t * 0.9) * 0.07),
        height * (0.18 + Math.cos(t * 0.7) * 0.06),
        maxDim * 0.56,
        currentPalette.orb1
      );
      drawOrb(
        width * (0.84 + Math.cos(t * 0.8) * 0.06),
        height * (0.24 + Math.sin(t * 1.1) * 0.07),
        maxDim * 0.58,
        currentPalette.orb2
      );
      drawOrb(
        width * (0.72 + Math.sin(t * 1.05 + 1.2) * 0.08),
        height * (0.82 + Math.cos(t * 0.85) * 0.06),
        maxDim * 0.52,
        currentPalette.orb3
      );
      drawOrb(
        width * (0.26 + Math.cos(t * 0.65 + 2.1) * 0.07),
        height * (0.78 + Math.sin(t * 0.95) * 0.06),
        maxDim * 0.54,
        currentPalette.orb4
      );
    };

    if (prefersReducedMotion) {
      drawFrame(0);
    } else {
      rafId = window.requestAnimationFrame(drawFrame);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Re-draw static frame when mode changes under prefers-reduced-motion
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    const p = MODE_PALETTES[mode];
    const width = canvas.width;
    const height = canvas.height;
    const maxDim = Math.max(width, height);
    const baseGrad = ctx.createLinearGradient(0, 0, width * 0.4, height);
    baseGrad.addColorStop(0, `rgb(${p.bgTop.join(',')})`);
    baseGrad.addColorStop(1, `rgb(${p.bgBottom.join(',')})`);
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, width, height);

    const drawStaticOrb = (
      cx: number,
      cy: number,
      radius: number,
      rgba: [number, number, number, number]
    ) => {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      g.addColorStop(0, `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`);
      g.addColorStop(0.5, `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${(rgba[3] * 0.42).toFixed(3)})`);
      g.addColorStop(1, `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    };
    drawStaticOrb(width * 0.16, height * 0.18, maxDim * 0.56, p.orb1);
    drawStaticOrb(width * 0.84, height * 0.24, maxDim * 0.58, p.orb2);
    drawStaticOrb(width * 0.72, height * 0.82, maxDim * 0.52, p.orb3);
    drawStaticOrb(width * 0.26, height * 0.78, maxDim * 0.54, p.orb4);
  }, [mode]);

  // 2. Smooth Cursor & Touch-Tracking Specular Light Sheen Across Primary Glass Cards
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let activeCard: HTMLElement | null = null;
    let pendingRaf = 0;
    let latestClientX = 0;
    let latestClientY = 0;
    let latestTarget: EventTarget | null = null;

    const clearActiveCard = () => {
      if (activeCard) {
        activeCard.style.setProperty('--sheen-active', '0');
        activeCard = null;
      }
    };

    const updateSheen = () => {
      pendingRaf = 0;
      const el =
        latestTarget instanceof Element
          ? (latestTarget.closest('.rose-glass-sheen') as HTMLElement | null)
          : null;

      if (!el) {
        clearActiveCard();
        return;
      }

      if (activeCard && activeCard !== el) {
        activeCard.style.setProperty('--sheen-active', '0');
      }
      activeCard = el;

      const rect = el.getBoundingClientRect();
      const x = latestClientX - rect.left;
      const y = latestClientY - rect.top;
      el.style.setProperty('--sheen-x', `${x.toFixed(1)}px`);
      el.style.setProperty('--sheen-y', `${y.toFixed(1)}px`);
      el.style.setProperty('--sheen-active', '1');
    };

    const scheduleUpdate = (clientX: number, clientY: number, target: EventTarget | null) => {
      latestClientX = clientX;
      latestClientY = clientY;
      latestTarget = target;
      if (!pendingRaf) {
        pendingRaf = window.requestAnimationFrame(updateSheen);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      scheduleUpdate(e.clientX, e.clientY, e.target);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const hit = document.elementFromPoint(touch.clientX, touch.clientY);
        scheduleUpdate(touch.clientX, touch.clientY, hit || e.target);
      }
    };

    const onPointerLeaveWindow = () => {
      clearActiveCard();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', clearActiveCard, { passive: true });
    document.addEventListener('mouseleave', onPointerLeaveWindow);

    return () => {
      if (pendingRaf) window.cancelAnimationFrame(pendingRaf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', clearActiveCard);
      document.removeEventListener('mouseleave', onPointerLeaveWindow);
      clearActiveCard();
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      data-ambient-mode={mode}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
      {/* Delicate CSS Silk Aurora Ribbon Overlay for Smooth Mode Warmth Blending */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          mode === 'rest'
            ? 'opacity-90'
            : mode === 'focus'
            ? 'opacity-65'
            : mode === 'gate'
            ? 'opacity-85'
            : 'opacity-75'
        }`}
        style={{
          background:
            mode === 'focus'
              ? 'radial-gradient(ellipse 80% 55% at 15% 10%, rgba(243, 233, 221, 0.55) 0%, transparent 65%), radial-gradient(ellipse 70% 55% at 88% 85%, rgba(244, 221, 227, 0.36) 0%, transparent 65%)'
              : mode === 'rest'
              ? 'radial-gradient(ellipse 80% 60% at 18% 15%, rgba(244, 221, 227, 0.58) 0%, transparent 68%), radial-gradient(ellipse 75% 60% at 85% 82%, rgba(232, 162, 181, 0.24) 0%, transparent 68%)'
              : 'radial-gradient(ellipse 80% 58% at 14% 12%, rgba(244, 221, 227, 0.52) 0%, transparent 66%), radial-gradient(ellipse 72% 58% at 86% 86%, rgba(243, 233, 221, 0.58) 0%, transparent 68%)',
        }}
      />
    </div>
  );
};
