export type SparkleKind = 'unlock' | 'hug' | 'session';

export interface SparkleBurstDetail {
  kind: SparkleKind;
  x?: number;
  y?: number;
}

type SparkleListener = (detail: SparkleBurstDetail) => void;

const listeners = new Set<SparkleListener>();

export function subscribeRoseGoldSparkles(listener: SparkleListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emitRoseGoldSparkles(
  kind: SparkleKind,
  coords?: { x?: number; y?: number }
): void {
  if (typeof window === 'undefined') return;
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  const detail: SparkleBurstDetail = {
    kind,
    x: coords?.x,
    y: coords?.y,
  };
  listeners.forEach((fn) => fn(detail));
}
