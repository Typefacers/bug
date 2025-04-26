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
}

const BugCrawler = (props: BugCrawlerProps) => {
  const { x, y, bug } = props;
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const isAlive = bug.active;

  const [position, setPosition] = useState({ x, y });
  const positionRef = useRef({ x, y });
  const [direction, setDirection] = useState(() => {
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
  });
  const lastTurnTime = useRef(Date.now());

  const bugImage = getBugImage(bug.id);

  useEffect(() => {
    const moveBug = () => {
      if (!isAlive) return;

      const now = Date.now();
      const timeSinceLastTurn = now - lastTurnTime.current;

      // Randomly change direction every 2-4 seconds
      if (timeSinceLastTurn > 2000 + Math.random() * 2000) {
        const angle = Math.random() * Math.PI * 2;
        setDirection({
          x: Math.cos(angle),
          y: Math.sin(angle),
        });
        lastTurnTime.current = now;
      }

      // Move in current direction
      const speed = 0.5; // Slower speed
      const newX = positionRef.current.x + direction.x * speed;
      const newY = positionRef.current.y + direction.y * speed;

      // Bounce off edges
      let newDirection = { ...direction };
      if (newX <= 0 || newX >= window.innerWidth - 40) {
        newDirection.x *= -1;
      }
      if (newY <= 0 || newY >= window.innerHeight - 40) {
        newDirection.y *= -1;
      }

      // Keep the bug within the viewport
      const boundedX = Math.max(0, Math.min(window.innerWidth - 40, newX));
      const boundedY = Math.max(0, Math.min(window.innerHeight - 40, newY));

      positionRef.current = { x: boundedX, y: boundedY };
      setPosition({ x: boundedX, y: boundedY });
      setDirection(newDirection);
    };

    const interval = setInterval(moveBug, 16); // ~60fps
    return () => clearInterval(interval);
  }, [direction]);

  // Calculate rotation angle in degrees, adjusting for initial image orientation
  const rotation = Math.atan2(direction.y, direction.x) * (180 / Math.PI) - 90;

  return (
    <>
      <motion.div
        initial={{ x, y }}
        animate={{
          x: position.x,
          y: position.y,
          transition: {
            duration: 0.016,
            ease: "linear",
            type: "tween",
          },
        }}
        onClick={() => setShowModal(true)}
        className="cursor-pointer"
      >
        <motion.img
          src={bugImage}
          alt={bug.title}
          className={clsx("w-10 h-10", !bug.active && "grayscale opacity-50")}
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setHoverPosition({ x: rect.left, y: rect.top });
            setShowPreview(true);
          }}
          onMouseLeave={() => setShowPreview(false)}
          style={{ rotate: rotation + 180 }}
        />

        {showPreview && isAlive &&
          ReactDOM.createPortal(
            <div
              className="fixed z-50 pointer-events-none"
              style={{
                left: hoverPosition.x + 50,
                top: hoverPosition.y,
              }}
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
