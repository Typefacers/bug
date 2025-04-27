import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bug } from "../types/bug";
import { getBugImage } from "../utils/utils";
import { BugCard } from "./BugCard";
import ReactDOM from "react-dom";
import clsx from "clsx";
import { useBugStore } from "../store";

/** -----------------------------------------------------------------------
 *  BugCrawler — makes a bug sprite wander with a lightweight 3-D effect
 *  ---------------------------------------------------------------------- */
interface BugCrawlerProps {
  x: number;
  y: number;
  bug: Bug;
  containerWidth: number;
  containerHeight: number;
}

const BugCrawler: React.FC<BugCrawlerProps> = ({
  x,
  y,
  bug,
  containerWidth,
  containerHeight,
}) => {
  /* ---------------- UI state ---------------- */
  const [showPreview, setShowPreview] = useState(false);
  const [hoverPos,    setHoverPos]    = useState({ x: 0, y: 0 });
  
  const inspectBug = useBugStore(s => s.inspectBug);
  const inspectedId = useBugStore(s => s.inspectedId);
  const showModal = inspectedId === bug.id;

  const isAlive = bug.active;

  /* -------------- position & heading -------------- */
  const [position, setPosition] = useState({ x, y });
  const positionRef = useRef({ x, y });

  const initialAngle = Math.random() * Math.PI * 2;
  const [direction, setDirection] = useState({
    x: Math.cos(initialAngle),
    y: Math.sin(initialAngle),
  });
  const directionRef = useRef(direction);

  /* -------------- timing refs -------------- */
  const lastTurn = useRef<number>(Date.now());
  const rafRef   = useRef<number>();

  /* keep refs fresh */
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  /* -------------- main rAF loop -------------- */
  useEffect(() => {
    const step = () => {
      if (!isAlive) return;

      const now           = Date.now();
      const elapsed       = now - lastTurn.current;
      const changeHeading = elapsed > 2000 + Math.random() * 2000;

      if (changeHeading) {
        const angle = Math.random() * Math.PI * 2;
        const dir   = { x: Math.cos(angle), y: Math.sin(angle) };
        directionRef.current = dir;
        setDirection(dir);
        lastTurn.current     = now;
      }

      const speed    = 0.6; // px / frame  ≈37 px/s @60fps
      const bugSize  = 40;
      let newX       = positionRef.current.x + directionRef.current.x * speed;
      let newY       = positionRef.current.y + directionRef.current.y * speed;
      const maxX     = (containerWidth  || window.innerWidth)  - bugSize;
      const maxY     = (containerHeight || window.innerHeight) - bugSize;

      if (newX <= 0 || newX >= maxX) {
        directionRef.current.x *= -1;
        newX = Math.max(0, Math.min(maxX, newX));
      }
      if (newY <= 0 || newY >= maxY) {
        directionRef.current.y *= -1;
        newY = Math.max(0, Math.min(maxY, newY));
      }

      positionRef.current = { x: newX, y: newY };
      setPosition(positionRef.current);

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isAlive, containerWidth, containerHeight]);

  /* -------------- transforms -------------- */
  const heading2D = Math.atan2(direction.y, direction.x) * 180 / Math.PI - 90;
  const tiltY     = direction.x * 25;
  const tiltX     = 18;
  const bugImage  = getBugImage(bug.id);

  /* ---------------- render ---------------- */
  return (
    <>
      {/* perspective wrapper gives our sprite depth */}
      <motion.div
        data-bug-id={bug.id}
        initial={{ x, y }}
        animate={{
          x: position.x,
          y: position.y,
          transition: { duration: 0.016, ease: "linear", type: "tween" },
        }}
        onClick={() => inspectBug(bug.id)}
        className="absolute cursor-pointer"
        style={{ perspective: 600, width: 40, height: 40, zIndex: 5 }}
      >
        <motion.img
          data-bug-id={bug.id}
          src={bugImage}
          alt={bug.title}
          onMouseEnter={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            setHoverPos({ x: rect.left, y: rect.top });
            setShowPreview(true);
          }}
          onMouseLeave={() => setShowPreview(false)}
          className={clsx(
            "w-full h-full will-change-transform",
            !bug.active && "grayscale opacity-50"
          )}
          animate={{
            rotate:  heading2D + 180,
            rotateY: tiltY,
            rotateX: tiltX,
            transition: { duration: 0.016, ease: "linear" },
          }}
          style={{
            transformStyle: "preserve-3d",
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))",
          }}
        />

        {/* hover card preview */}
        {showPreview && isAlive &&
          ReactDOM.createPortal(
            <div
              className="fixed z-50 pointer-events-none"
              style={{ left: hoverPos.x + 50, top: hoverPos.y }}
            >
              <BugCard bug={bug} preview />
            </div>,
            document.body
          )}
      </motion.div>

      {/* modal on click */}
      {showModal && isAlive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="relative">
            <button
              onClick={() => inspectBug("")}
              className="absolute -top-8 -right-8 size-8 rounded-full bg-white p-1"
            >
              ✕
            </button>
            <BugCard bug={bug} />
          </div>
        </div>
      )}
    </>
  );
};

export default BugCrawler;