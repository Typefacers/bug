import { ReactNode } from "react";
import { Minus, Square, X as CloseIcon } from "lucide-react";

/**
 * Win95Window — A reusable Windows 95-style window container.
 *
 * Wrap any page content in this component to give it classic Win95 chrome.
 */
export default function Win95Window({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  /* 3-D border helpers */
  const raised =
    "border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500";
  const windowShadow =
    "shadow-[inset_-2px_-2px_0_0_rgba(0,0,0,0.55),inset_2px_2px_0_0_rgba(255,255,255,0.8)]";

  return (
    <div className="min-h-screen bg-[#008080] flex items-start justify-center p-4 font-[\'MS_Sans_Serif\',\'Tahoma\',sans-serif]">
      <div className={`w-full max-w-7xl bg-[#C0C0C0] ${raised} ${windowShadow}`}>
        {/* Title-bar */}
        <div className="h-8 bg-[#000080] flex items-center justify-between px-2 text-white select-none border-b-2 border-b-white">
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
                className={`w-6 h-6 bg-[#C0C0C0] flex items-center justify-center ${raised} hover:bg-[#A0A0A0] active:bg-[#A0A0A0] transition-colors`}
              >
                <Icon className="h-3 w-3 text-black" />
              </button>
            ))}
          </div>
        </div>

        {/* Window content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}