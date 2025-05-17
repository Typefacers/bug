import React from "react";
import { Minus, Square, X as CloseIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Win95Window — A reusable Windows 95-style window container.
 *
 * Wrap any page content in this component to give it classic Win95 chrome.
 */
type Win95WindowProps = {
  title: string;
  children: React.ReactNode;
};

export function Win95Window({ title, children }: Win95WindowProps) {
  /* 3-D border + inner shadow helpers */
  const raised =
    "border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500";
  const windowShadow =
    "shadow-[inset_-2px_-2px_0_0_rgba(0,0,0,0.55),inset_2px_2px_0_0_rgba(255,255,255,0.8)]";

  const [minimized, setMinimized] = React.useState(false);
  const [maximized, setMaximized] = React.useState(false);
  const [closed, setClosed] = React.useState(false);

  if (closed) return null;

  return (
    <AnimatePresence initial={false}>
      {!closed && (
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className={`w-full bg-[#C0C0C0] ${raised} ${windowShadow} flex flex-col flex-grow ${maximized ? 'fixed inset-2 z-50' : ''}`}
        >
          {/* Title-bar */}
          <div className="h-8 select-none border-b-2 border-b-white bg-[#000080] px-2 text-white">
            <div className="flex h-full items-center justify-between">
              <span className="font-bold tracking-wider">{title}</span>
              <div className="flex gap-px">
                <button
                  aria-label="Minimize"
                  onClick={() => setMinimized((m) => !m)}
                  className={`flex h-6 w-6 items-center justify-center bg-[#C0C0C0] ${raised} transition-colors hover:bg-[#A0A0A0] active:bg-[#A0A0A0]`}
                >
                  <Minus className="h-3 w-3 text-black" />
                </button>
                <button
                  aria-label="Maximize"
                  onClick={() => setMaximized((m) => !m)}
                  className={`flex h-6 w-6 items-center justify-center bg-[#C0C0C0] ${raised} transition-colors hover:bg-[#A0A0A0] active:bg-[#A0A0A0]`}
                >
                  <Square className="h-3 w-3 text-black" />
                </button>
                <button
                  aria-label="Close"
                  onClick={() => setClosed(true)}
                  className={`flex h-6 w-6 items-center justify-center bg-[#C0C0C0] ${raised} transition-colors hover:bg-[#A0A0A0] active:bg-[#A0A0A0]`}
                >
                  <CloseIcon className="h-3 w-3 text-black" />
                </button>
              </div>
            </div>
          </div>

          {/* Window content */}
          <AnimatePresence initial={false}>
            {!minimized && (
              <motion.div
                key="content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-[#E0E0E0] p-4 overflow-hidden flex-grow"
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Win95Window;
