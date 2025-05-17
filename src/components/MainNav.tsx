import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Minus, Square, X as CloseIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";

/**
 * MainNav — Windows 95-style navigation window that stays at the top.
 */
export function MainNav() {
  const location = useLocation();

  /* 3-D border + inner shadow helpers (same as Win95Window) */
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
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`${maximized ? 'fixed top-0 left-0 right-0 z-50' : 'sticky top-0 z-50'} flex w-full justify-center bg-[#008080] p-2`}
        >
          {/* Win95 frame */}
          <div
            className={`w-full max-w-7xl bg-[#C0C0C0] ${raised} ${windowShadow}`}
          >
            {/* Title-bar */}
            <div className="h-8 select-none border-b-2 border-b-white bg-[#000080] px-2 text-white">
              <div className="flex h-full items-center justify-between">
                <span className="font-bold tracking-wider">Bug Bounty Navigation</span>
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

            {/* Navigation content */}
            <AnimatePresence initial={false}>
              {!minimized && (
                <motion.div
                  key="nav"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#E0E0E0] p-3 overflow-hidden"
                >
                  <NavigationMenu>
                    <NavigationMenuList className="flex gap-2">
              <NavigationMenuItem>
                <Link to="/">
                  <Button
                    variant={location.pathname === "/" ? "emerald" : "gray"}
                    className="w-32"
                  >
                    🐛 Bugs
                  </Button>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/dashboard">
                  <Button
                    variant={
                      location.pathname === "/dashboard" ? "secondary" : "gray"
                    }
                    className="w-32"
                  >
                    📊 Dashboard
                  </Button>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/bounty-leaderboard">
                  <Button
                    variant={
                      location.pathname === "/bounty-leaderboard"
                        ? "indigo"
                        : "gray"
                    }
                    className="w-32"
                  >
                    🏆 Leaderboard
                  </Button>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MainNav;