import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Minus, Square, X as CloseIcon } from "lucide-react";

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

  return (
    <div className="sticky top-0 z-50 flex w-full justify-center bg-[#008080] p-2">
      {/* Win95 frame */}
      <div
        className={`w-full max-w-7xl bg-[#C0C0C0] ${raised} ${windowShadow}`}
      >
        {/* Title-bar */}
        <div className="h-8 select-none border-b-2 border-b-white bg-[#000080] px-2 text-white">
          <div className="flex h-full items-center justify-between">
            <span className="font-bold tracking-wider">Bug Bounty Navigation</span>
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

        {/* Navigation content */}
        <div className="bg-[#E0E0E0] p-3">
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
        </div>
      </div>
    </div>
  );
}

export default MainNav;