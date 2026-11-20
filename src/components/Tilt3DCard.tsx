import React, { useEffect, useRef, useState } from 'react';

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTiltDeg?: number;
  scaleOnHover?: number;
  disabled?: boolean;
  as?: 'div' | 'article';
}

export const Tilt3DCard: React.FC<Tilt3DCardProps> = ({
  children,
  className = '',
  maxTiltDeg = 6,
  scaleOnHover = 1.012,
  disabled = false,
  as = 'div',
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const articleRef = useRef<HTMLElement | null>(null);
  const [tilt, setTilt] = useState<{ rx: number; ry: number; active: boolean }>({
    rx: 0,
    ry: 0,
    active: false,
  });
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mql.matches);
    sync();
    mql.addEventListener?.('change', sync);
    return () => mql.removeEventListener?.('change', sync);
  }, []);

  const isDisabled = disabled || reducedMotion;

  const updateTiltFromClientCoords = (clientX: number, clientY: number) => {
    if (isDisabled) return;
    const el = as === 'article' ? articleRef.current : divRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const nx = (clientX - rect.left) / rect.width; // 0..1
    const ny = (clientY - rect.top) / rect.height; // 0..1
    const clampedX = Math.max(0, Math.min(1, nx));
    const clampedY = Math.max(0, Math.min(1, ny));

    const rx = (0.5 - clampedY) * (maxTiltDeg * 2);
    const ry = (clampedX - 0.5) * (maxTiltDeg * 2);

    setTilt({ rx, ry, active: true });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    updateTiltFromClientCoords(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    const touch = e.touches[0];
    if (touch) {
      updateTiltFromClientCoords(touch.clientX, touch.clientY);
    }
  };

  const resetTilt = () => {
    setTilt((prev) =>
      prev.rx === 0 && prev.ry === 0 && !prev.active
        ? prev
        : { rx: 0, ry: 0, active: false }
    );
  };

  const style: React.CSSProperties = isDisabled
    ? {}
    : {
        transform: tilt.active
          ? `perspective(1000px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, 1)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transformStyle: 'preserve-3d',
        transition: tilt.active
          ? 'transform 110ms cubic-bezier(0.16, 1, 0.3, 1)'
          : 'transform 520ms cubic-bezier(0.22, 1.35, 0.36, 1)',
        willChange: tilt.active ? 'transform' : 'auto',
      };

  if (as === 'article') {
    return (
      <article
        ref={articleRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        onTouchMove={handleTouchMove}
        onTouchEnd={resetTilt}
        onTouchCancel={resetTilt}
        style={style}
        className={className}
      >
        {children}
      </article>
    );
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      onTouchMove={handleTouchMove}
      onTouchEnd={resetTilt}
      onTouchCancel={resetTilt}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
};
