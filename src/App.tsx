import { BrowserRouter, Routes, Route } from "react-router-dom";
import Bugs from "./routes/Bugs";
import Leaderboard from "./routes/Leaderboard";
import UserProfile from "./routes/UserProfile";
import { MainNav } from "./components/MainNav";

export default function App() {
	return (
		<BrowserRouter>
			<MainNav />

			<Routes>
				<Route path="/" element={<Bugs />} />
				<Route path="/bounty-leaderboard" element={<Leaderboard />} />
				<Route path="/user/:userId" element={<UserProfile />} />
			</Routes>
		</BrowserRouter>
	);
}
