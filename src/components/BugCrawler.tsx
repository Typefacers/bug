import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bug } from "../types/bug";
import { getBugImage } from "../utils/utils";
import { BugCard } from "./BugCard";
import ReactDOM from "react-dom";
import clsx from "clsx";

/** -----------------------------------------------------------------------
 *  BugCrawler — makes a bug sprite wander around the screen with a
 *  lightweight 3-D “cardboard cut-out” effect (no real 3-D models required)
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
  /* ---------- UI state ---------- */
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const isAlive = bug.active;

  /* ---------- position & direction ---------- */
  const [position, setPosition] = useState({ x, y });
  const positionRef = useRef({ x, y });

  // pick a random heading to start
  const initialAngle = Math.random() * Math.PI * 2;
  const [direction, setDirection] = useState({
    x: Math.cos(initialAngle),
    y: Math.sin(initialAngle),
  });
  const directionRef = useRef(direction);

  /* ---------- timing & rAF refs ---------- */
  const lastTurnTime = useRef<number>(Date.now());
  const animationFrameRef = useRef<number>();

  /* Keep refs in sync with state so rAF loop sees updates */
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  /* ---------- main rAF loop ---------- */
  useEffect(() => {
    const step = () => {
      if (!isAlive) return; // pause when bug is squashed

      const now = Date.now();
      const sinceLastTurn = now - lastTurnTime.current;

      /* change heading every 2–4 s */
      if (sinceLastTurn > 2000 + Math.random() * 2000) {
        const angle = Math.random() * Math.PI * 2;
        const newDir = { x: Math.cos(angle), y: Math.sin(angle) };
        directionRef.current = newDir;
        setDirection(newDir);
        lastTurnTime.current = now;
      }

      const speed = 0.6; // px / frame  (~37 px/s @ 60 fps)
      const bugSize = 40;

      let newX = positionRef.current.x + directionRef.current.x * speed;
      let newY = positionRef.current.y + directionRef.current.y * speed;

      /* bounce off container walls */
      const maxX = (containerWidth || window.innerWidth) - bugSize;
      const maxY = (containerHeight || window.innerHeight) - bugSize;

      if (newX <= 0 || newX >= maxX) {
        directionRef.current = {
          ...directionRef.current,
          x: -directionRef.current.x,
        };
        newX = Math.max(0, Math.min(maxX, newX));
      }
      if (newY <= 0 || newY >= maxY) {
        directionRef.current = {
          ...directionRef.current,
          y: -directionRef.current.y,
        };
        newY = Math.max(0, Math.min(maxY, newY));
      }

      positionRef.current = { x: newX, y: newY };
      setPosition(positionRef.current);

      /* queue next frame */
      animationFrameRef.current = requestAnimationFrame(step);
    };

    /* kick off loop */
    animationFrameRef.current = requestAnimationFrame(step);

    /* cleanup on unmount */
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isAlive, containerWidth, containerHeight]);

  /* ---------- derived transforms ---------- */
  const heading2D = Math.atan2(direction.y, direction.x) * (180 / Math.PI) - 90;

  // tilt the card left/right based on x-direction, max ±25°
  const tiltY = direction.x * 25;

  // constant slight pitch so bug face looks up from the “floor”
  const tiltX = 18;

  const bugImage = getBugImage(bug.id);

  /* ---------- render ---------- */
  return (
    <>
      {/* perspective wrapper gives our sprite depth 👇 */}
      <motion.div
        initial={{ x, y }}
        animate={{
          x: position.x,
          y: position.y,
          transition: { duration: 0.016, ease: "linear", type: "tween" },
        }}
        onClick={() => setShowModal(true)}
        className="absolute cursor-pointer"
        style={{
          perspective: 600, // sets vanishing-point distance
          width: "40px",
          height: "40px",
          zIndex: 5,
        }}
      >
        <motion.img
          src={bugImage}
          alt={bug.title}
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setHoverPosition({ x: rect.left, y: rect.top });
            setShowPreview(true);
          }}
          onMouseLeave={() => setShowPreview(false)}
          className={clsx(
            "w-full h-full will-change-transform",
            !bug.active && "grayscale opacity-50"
          )}
          /* 3-D transform magic happens here */
          animate={{
            rotate: heading2D + 180, // keep previous rotation logic
            rotateY: tiltY,
            rotateX: tiltX,
            transition: { duration: 0.016, ease: "linear" },
          }}
          style={{
            transformStyle: "preserve-3d",
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))",
          }}
        />

        {/* hover “card” preview ------------------------------------------------ */}
        {showPreview &&
          isAlive &&
          ReactDOM.createPortal(
            <div
              className="fixed z-50 pointer-events-none"
              style={{ left: hoverPosition.x + 50, top: hoverPosition.y }}
            >
              <BugCard bug={bug} preview />
            </div>,
            document.body
          )}
      </motion.div>

      {/* click-through modal --------------------------------------------------- */}
      {showModal && isAlive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="relative">
            <button
              onClick={() => setShowModal(false)}
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