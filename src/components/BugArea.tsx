import { useEffect, useMemo, useRef, useState } from "react";
import { Bug } from "../types/bug";
import BugCrawler from "./BugCrawler";
import AimCursor from "./AimCursor";
import { useBugStore } from "../store";

/** Evenly spreads bugs, then shuffles and jitters them for an organic layout. */
interface BugAreaProps {
  bugs: Bug[];
}

const SPEED = 320; // px per second the aim moves when a key is held

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

  /* ---------- aim tracking ---------- */
  const [aim, setAim] = useState({ x: 0, y: 0 });
  const aimRef = useRef(aim);

  useEffect(() => {
    if (size.width && size.height) {
      // center when area first ready
      const c = { x: size.width / 2, y: size.height / 2 };
      setAim(c);
      aimRef.current = c;
    }
  }, [size.width, size.height]);

  useEffect(() => {
    aimRef.current = aim;
  }, [aim]);

  /* ---------- mouse movement tracking ---------- */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Clamp coordinates to container bounds
      const clampedX = Math.max(0, Math.min(size.width, x));
      const clampedY = Math.max(0, Math.min(size.height, y));
      
      setAim({ x: clampedX, y: clampedY });
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [size.width, size.height]);

  const squashBug = useBugStore((s) => s.squashBug);
  const inspectBug = useBugStore((s) => s.inspectBug);

  /* ---------- shoot logic ---------- */
  const shoot = () => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const pageX = rect.left + aimRef.current.x;
    const pageY = rect.top + aimRef.current.y;

    const elements = document.elementsFromPoint(pageX, pageY) as HTMLElement[];
    for (const el of elements) {
      let node: HTMLElement | null = el;
      while (node && node !== container) {
        const idAttr = node.getAttribute?.("data-bug-id");
        if (idAttr) {
          // Simulate a click on the element to trigger the onClick handler
          node.click();
          return;
        }
        node = node.parentElement;
      }
    }
  };

  /* ---------- key press state ---------- */
  const pressedRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  /* ---------- keyboard listeners ---------- */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      let handled = false;
      switch (e.key.toLowerCase()) {
        case "w":
          pressedRef.current.up = true;
          handled = true;
          break;
        case "s":
          pressedRef.current.down = true;
          handled = true;
          break;
        case "a":
          pressedRef.current.left = true;
          handled = true;
          break;
        case "d":
          pressedRef.current.right = true;
          handled = true;
          break;
        default:
          break;
      }

      if (e.code === "Space") {
        shoot();
        handled = true;
      }

      if (handled) e.preventDefault();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
          pressedRef.current.up = false;
          break;
        case "s":
          pressedRef.current.down = false;
          break;
        case "a":
          pressedRef.current.left = false;
          break;
        case "d":
          pressedRef.current.right = false;
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  /* ---------- mouse click for shooting ---------- */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseClick = () => {
      shoot();
    };

    container.addEventListener('click', handleMouseClick);
    return () => {
      container.removeEventListener('click', handleMouseClick);
    };
  }, []);

  /* ---------- rAF loop for smooth movement ---------- */
  useEffect(() => {
    let last = performance.now();
    let rafId: number;

    const step = (now: number) => {
      const dt = (now - last) / 1000; // seconds
      last = now;

      const { up, down, left, right } = pressedRef.current;
      if (up || down || left || right) {
        setAim((prev) => {
          let { x, y } = prev;
          const dx =
            (right ? 1 : 0) - (left ? 1 : 0); // +1 right, -1 left, 0 none
          const dy =
            (down ? 1 : 0) - (up ? 1 : 0); // +1 down, -1 up, 0 none

          if (dx || dy) {
            const mag = Math.hypot(dx, dy) || 1;
            x += (dx / mag) * SPEED * dt;
            y += (dy / mag) * SPEED * dt;
            // clamp
            x = Math.max(0, Math.min(size.width, x));
            y = Math.max(0, Math.min(size.height, y));
          }

          aimRef.current = { x, y };
          return aimRef.current;
        });
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [size.width, size.height]);

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
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none"
    >
      {/* Aim cross-hair */}
      <AimCursor x={aim.x} y={aim.y} />

      {/* All moving bugs */}
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