import React from "react";
import { Minus, Square, X as CloseIcon } from "lucide-react";

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

  return (
    <div className={`w-full bg-[#C0C0C0] ${raised} ${windowShadow}`}>
      {/* Title-bar */}
      <div className="h-8 select-none border-b-2 border-b-white bg-[#000080] px-2 text-white">
        <div className="flex h-full items-center justify-between">
          <span className="font-bold tracking-wider">{title}</span>
          <div className="flex gap-px">
            {[
              { Icon: Minus, label: "Minimize" },
              { Icon: Square, label: "Maximize" },
              { Icon: CloseIcon, label: "Close" },
            ].map(({ Icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className={`flex h-6 w-6 items-center justify-center bg-[#C0C0C0] ${raised} transition-colors hover:bg-[#A0A0A0] active:bg-[#A0A0A0]`}
              >
                <Icon className="h-3 w-3 text-black" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Window content */}
      <div className="bg-[#E0E0E0] p-4">
        {children}
      </div>
    </div>
  );
}

export default Win95Window;