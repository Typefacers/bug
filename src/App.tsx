import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import Bugs from "./routes/Bugs";
import Leaderboard from "./routes/Leaderboard";
import UserProfile from "./routes/UserProfile";
import Dashboard from "./routes/Dashboard";
import NewBug from "./routes/NewBug";
import { Minus, Square, X as CloseIcon } from "lucide-react";

function AppContent() {
	const location = useLocation();
	const getWindowTitle = () => {
		switch (location.pathname) {
			case "/":
				return "Bug Basher";
			case "/dashboard":
				return "Bug Dashboard";
			case "/bounty-leaderboard":
				return "Bug Bounty Leaderboard";
			case "/bug/new":
				return "File a Bug";
			default:
				if (location.pathname.startsWith("/user/")) return "User Profile";
				return "Bug Bounty";
		}
	};

	/* 3-D border helpers */
	const raised = "border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500";
	const windowShadow = "shadow-[inset_-2px_-2px_0_0_rgba(0,0,0,0.55),inset_2px_2px_0_0_rgba(255,255,255,0.8)]";

	return (
		<div className="min-h-screen bg-[#008080] p-4 font-['MS_Sans_Serif','Tahoma',sans-serif] flex flex-col">
			<div className="mx-auto max-w-7xl w-full flex-grow flex">
				{/* Single Win95 Window */}
				<div className={`w-full bg-[#C0C0C0] ${raised} ${windowShadow} flex flex-col`}>
					{/* Title-bar */}
					<div className="h-8 select-none border-b-2 border-b-white bg-[#000080] px-2 text-white z-10">
						<div className="flex h-full items-center justify-between">
							<span className="font-bold tracking-wider">{getWindowTitle()}</span>
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

					{/* Window Content Area */}
					<div className="bg-[#E0E0E0] p-3 flex flex-col flex-grow">
						{/* Navigation Tabs */}
						<div className="mb-4 bg-[#C0C0C0] flex gap-1 p-1 sticky top-0 z-10">
							<Link to="/" className={`px-4 py-1 ${location.pathname === "/" ? "bg-[#E0E0E0] font-semibold" : "hover:bg-[#D0D0D0]"}`}>
								🐛 Bugs
							</Link>
							<Link to="/dashboard" className={`px-4 py-1 ${location.pathname === "/dashboard" ? "bg-[#E0E0E0] font-semibold" : "hover:bg-[#D0D0D0]"}`}>
								📊 Dashboard
							</Link>
							<Link to="/bounty-leaderboard" className={`px-4 py-1 ${location.pathname === "/bounty-leaderboard" ? "bg-[#E0E0E0] font-semibold" : "hover:bg-[#D0D0D0]"}`}>
								🏆 Leaderboard
							</Link>
						</div>

						{/* Route Content */}
						<div className="p-2 overflow-auto relative z-0 flex-grow flex flex-col">
							<Routes>
								<Route path="/" element={<Bugs />} />
								<Route path="/dashboard" element={<Dashboard />} />
								<Route path="/bounty-leaderboard" element={<Leaderboard />} />
								<Route path="/user/:userId" element={<UserProfile />} />
								<Route path="/bug/new" element={<NewBug />} />
							</Routes>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<AppContent />
		</BrowserRouter>
	);
}
