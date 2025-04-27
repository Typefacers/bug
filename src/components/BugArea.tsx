import { useEffect, useMemo, useRef, useState } from "react";
import { Bug } from "../types/bug";
import BugCrawler from "./BugCrawler";

/** Evenly spreads bugs, then shuffles and jitters them for an organic layout. */
interface BugAreaProps {
  bugs: Bug[];
}

const BugArea: React.FC<BugAreaProps> = ({ bugs }) => {
  /* ---------- container size tracking ---------- */
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      setSize({ width, height });
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* ---------- one-time shuffle of bug order ---------- */
  const [order, setOrder] = useState<number[]>([]);
  useEffect(() => {
    const indices = bugs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setOrder(indices);
  }, [bugs.length]);

  /* ---------- deterministic jitter helpers ---------- */
  const rand = (seed: number) => {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x); // 0‒1
  };

  /* ---------- compute grid cell centers with jitter ---------- */
  const positions = useMemo(() => {
    const { width, height } = size;
    const count = bugs.length;
    if (!width || !height || !count) return [];

    const bugSize = 40; // should match BugCrawler
    const cols = Math.ceil(Math.sqrt((count * width) / height));
    const rows = Math.ceil(count / cols);
    const cellW = width / cols;
    const cellH = height / rows;

    return Array.from({ length: count }, (_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const cx = col * cellW + cellW / 2;
      const cy = row * cellH + cellH / 2;

      const maxDx = Math.max(0, cellW / 2 - bugSize / 2);
      const maxDy = Math.max(0, cellH / 2 - bugSize / 2);
      const dx = (rand(i) - 0.5) * 2 * maxDx;
      const dy = (rand(i * 7) - 0.5) * 2 * maxDy;

      const x = cx + dx - bugSize / 2;
      const y = cy + dy - bugSize / 2;
      return { x, y };
    });
  }, [bugs.length, size]);

  /* ---------- render ---------- */
  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      {order.map((bugIdx, i) => {
        const bug = bugs[bugIdx];
        const pos = positions[i];
        if (!bug || !pos) return null;
        return (
          <BugCrawler
            key={bug.id}
            bug={bug}
            x={pos.x}
            y={pos.y}
            containerWidth={size.width}
            containerHeight={size.height}
          />
        );
      })}
    </div>
  );
};

export default BugArea;