import * as React from "react";
import { Link, useLocation } from "react-router-dom";

import { cn } from "../lib/utils";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "./ui/navigation-menu";
import { Button } from "./ui/button";

export function MainNav() {
	const location = useLocation();

	return (
		<div className="sticky top-0 z-10 flex items-center justify-center gap-4 bg-white/80 py-4 shadow backdrop-blur">
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<Link to="/">
							<Button variant={location.pathname === "/" ? "emerald" : "gray"} className="w-32">
								🐛 Bugs
							</Button>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link to="/dashboard">
							<Button variant={location.pathname === "/dashboard" ? "secondary" : "gray"} className="w-32">
								📊 Dashboard
							</Button>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link to="/bounty-leaderboard">
							<Button variant={location.pathname === "/bounty-leaderboard" ? "indigo" : "gray"} className="w-32">
								🏆 Leaderboard
							</Button>
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
