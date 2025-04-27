import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bug } from "../types/bug";
import { getBugImage } from "../utils/utils";
import { BugCard } from "./BugCard";
import ReactDOM from "react-dom";
import clsx from "clsx";

interface BugCrawlerProps {
  x: number;
  y: number;
  bug: Bug;
  containerWidth: number;
  containerHeight: number;
}

const BugCrawler = (props: BugCrawlerProps) => {
  const { x, y, bug, containerWidth, containerHeight } = props;

  /* ---------- UI state ---------- */
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const isAlive = bug.active;

  /* ---------- position & direction ---------- */
  const [position, setPosition] = useState({ x, y });
  const positionRef = useRef({ x, y });

  const initialAngle = Math.random() * Math.PI * 2;
  const [direction, setDirection] = useState({
    x: Math.cos(initialAngle),
    y: Math.sin(initialAngle),
  });
  const directionRef = useRef(direction);

  /* ---------- timing & rAF refs ---------- */
  const lastTurnTime = useRef<number>(Date.now());
  const animationFrameRef = useRef<number>();

  /* Keep directionRef in sync with state */
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  /* ---------- requestAnimationFrame loop ---------- */
  useEffect(() => {
    const step = () => {
      if (!isAlive) return; // paused if bug is squashed

      const now = Date.now();
      const millisSinceTurn = now - lastTurnTime.current;

      /* Randomly change direction every 2-4 s */
      if (millisSinceTurn > 2000 + Math.random() * 2000) {
        const angle = Math.random() * Math.PI * 2;
        const newDir = { x: Math.cos(angle), y: Math.sin(angle) };
        directionRef.current = newDir;
        setDirection(newDir);
        lastTurnTime.current = now;
      }

      const speed = 0.6; // pixels per frame
      const bugSize = 40;

      let newX = positionRef.current.x + directionRef.current.x * speed;
      let newY = positionRef.current.y + directionRef.current.y * speed;

      /* Bounce off walls */
      if (newX <= 0 || newX >= (containerWidth || window.innerWidth) - bugSize) {
        directionRef.current = { ...directionRef.current, x: -directionRef.current.x };
        newX = Math.max(0, Math.min((containerWidth || window.innerWidth) - bugSize, newX));
      }
      if (newY <= 0 || newY >= (containerHeight || window.innerHeight) - bugSize) {
        directionRef.current = { ...directionRef.current, y: -directionRef.current.y };
        newY = Math.max(0, Math.min((containerHeight || window.innerHeight) - bugSize, newY));
      }

      /* Commit new position */
      positionRef.current = { x: newX, y: newY };
      setPosition(positionRef.current);

      /* Queue next frame */
      animationFrameRef.current = requestAnimationFrame(step);
    };

    /* Kick off animation */
    animationFrameRef.current = requestAnimationFrame(step);

    /* Cleanup */
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isAlive, containerWidth, containerHeight]);

  /* ---------- derived rotation ---------- */
  const rotation = Math.atan2(direction.y, direction.x) * (180 / Math.PI) - 90;
  const bugImage = getBugImage(bug.id);

  /* ---------- render ---------- */
  return (
    <>
      <motion.div
        initial={{ x, y }}
        animate={{
          x: position.x,
          y: position.y,
          transition: { duration: 0.016, ease: "linear", type: "tween" },
        }}
        onClick={() => setShowModal(true)}
        className="cursor-pointer absolute"
        style={{ zIndex: 5 }}
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
          className={clsx("w-10 h-10", !bug.active && "grayscale opacity-50")}
          style={{ rotate: rotation + 180 }}
        />

        {showPreview && isAlive &&
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

      {showModal && isAlive && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-8 -right-8 bg-white rounded-full p-1 size-8"
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