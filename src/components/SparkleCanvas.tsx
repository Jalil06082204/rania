import React, { useEffect, useRef } from 'react';
import {
  SparkleBurstDetail,
  subscribeRoseGoldSparkles,
} from '../utils/sparkles';

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  vRot: number;
  color: string;
  isStar: boolean;
}

const ROSE_GOLD_PALETTE = [
  'rgba(232, 162, 181, 0.95)', // warm blush rose
  'rgba(214, 152, 128, 0.92)', // rose-gold champagne
  'rgba(244, 212, 184, 0.92)', // pale champagne gold
  'rgba(201, 122, 146, 0.90)', // dusty rose
  'rgba(255, 246, 238, 0.95)', // luminous ivory glint
];

export const SparkleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<SparkleParticle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const drawFourPointStar = (
      x: number,
      y: number,
      radius: number,
      rot: number,
      color: string,
      alpha: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = color;

      ctx.beginPath();
      const inner = radius * 0.28;
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? radius : inner;
        const angle = (i * Math.PI) / 4;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawSoftMote = (
      x: number,
      y: number,
      radius: number,
      color: string,
      alpha: number
    ) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.2);
      grad.addColorStop(0, color);
      grad.addColorStop(1, 'rgba(255, 249, 246, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    let lastTs = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.008, (now - lastTs) / 1000));
      lastTs = now;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const list = particlesRef.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          list.splice(i, 1);
          continue;
        }

        const progress = p.life / p.maxLife;
        // Fade in quickly then settle away smoothly
        const fade =
          progress < 0.18
            ? progress / 0.18
            : 1 - Math.pow((progress - 0.18) / 0.82, 1.5);

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 - 12 * dt; // gentle buoyant upward drift
        p.rotation += p.vRot * dt;

        const currentAlpha = p.alpha * fade;
        if (p.isStar) {
          drawFourPointStar(
            p.x,
            p.y,
            p.size,
            p.rotation,
            p.color,
            currentAlpha
          );
        } else {
          drawSoftMote(p.x, p.y, p.size * 0.65, p.color, currentAlpha);
        }
      }

      if (list.length > 0) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    const spawnBurst = (detail: SparkleBurstDetail) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const originX = detail.x ?? w * 0.5;
      const originY =
        detail.y ?? (detail.kind === 'unlock' ? h * 0.44 : h * 0.42);

      const count =
        detail.kind === 'unlock' ? 36 : detail.kind === 'hug' ? 28 : 32;
      const spreadX = detail.kind === 'unlock' ? 140 : 120;
      const spreadY = detail.kind === 'hug' ? 95 : 110;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 28 + Math.random() * 88;
        particlesRef.current.push({
          x: originX + (Math.random() - 0.5) * spreadX,
          y: originY + (Math.random() - 0.5) * spreadY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 24,
          size: 3.2 + Math.random() * 5.2,
          alpha: 0.68 + Math.random() * 0.3,
          life: 0,
          maxLife: 1.3 + Math.random() * 1.1,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 2.2,
          color:
            ROSE_GOLD_PALETTE[
              Math.floor(Math.random() * ROSE_GOLD_PALETTE.length)
            ],
          isStar: Math.random() > 0.35,
        });
      }

      if (rafRef.current === null) {
        lastTs = performance.now();
        rafRef.current = window.requestAnimationFrame(tick);
      }
    };

    const unsubscribe = subscribeRoseGoldSparkles(spawnBurst);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', resize);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[60] pointer-events-none"
    />
  );
};
