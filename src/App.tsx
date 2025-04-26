import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Bugs from "./routes/Bugs";
import Leaderboard from "./routes/Leaderboard";
import UserProfile from "./routes/UserProfile";

export default function App() {
	return (
		<BrowserRouter>
			<header className="sticky top-0 z-10 flex items-center justify-center gap-4 bg-white/80 py-4 shadow backdrop-blur">
				<NavLink to="/" end className={({ isActive }) => `btn ${isActive ? "bg-emerald-600" : "bg-gray-400"}`}>
					🐛 Bugs
				</NavLink>
				<NavLink to="/bounty-leaderboard" className={({ isActive }) => `btn ${isActive ? "bg-indigo-600" : "bg-gray-400"}`}>
					🏆 Leaderboard
				</NavLink>
			</header>

			<Routes>
				<Route path="/" element={<Bugs />} />
				<Route path="/bounty-leaderboard" element={<Leaderboard />} />
				<Route path="/user/:userId" element={<UserProfile />} />
			</Routes>
		</BrowserRouter>
	);
}
