import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useBugStore } from "../store";
import { Bug } from "../types/bug";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { CalendarIcon, CheckCircleIcon, AlertTriangleIcon, TrendingUpIcon, BugIcon, AreaChartIcon, RocketIcon, ZapIcon, TimerIcon, TargetIcon, CrownIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import BugTrendsChart from "../components/BugTrendsChart";
import { useNavigate } from "react-router-dom";

// Helper function to calculate total bounty
const calculateTotalBounty = (bugs: Bug[]): number => bugs.reduce((total, bug) => total + bug.bounty, 0);

// Helper function to format date
const formatDate = (date: Date): string =>
	new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);

// Simple chart component for bug priority distribution
const PriorityChart = ({ bugs }: { bugs: Bug[] }) => {
	const high = bugs.filter((b) => b.priority === "high").length;
	const medium = bugs.filter((b) => b.priority === "medium").length;
	const low = bugs.filter((b) => b.priority === "low").length;
	const total = bugs.length || 1; // Avoid division by zero

	return (
		<div className="flex h-[60px] items-end gap-1">
			<motion.div initial={{ height: 0 }} animate={{ height: `${(high / total) * 100}%` }} transition={{ duration: 1 }} className="w-1/3 bg-red-500 rounded-t" />
			<motion.div initial={{ height: 0 }} animate={{ height: `${(medium / total) * 100}%` }} transition={{ duration: 1, delay: 0.2 }} className="w-1/3 bg-amber-500 rounded-t" />
			<motion.div initial={{ height: 0 }} animate={{ height: `${(low / total) * 100}%` }} transition={{ duration: 1, delay: 0.4 }} className="w-1/3 bg-blue-500 rounded-t" />
		</div>
	);
};

// Activity timeline component
const ActivityTimeline = ({ bugs }: { bugs: Bug[] }) => {
	// Sort bugs by createdAt or resolvedAt date
	const recentActivity = [...bugs]
		.filter((bug) => bug.createdAt || bug.resolvedAt)
		.sort((a, b) => {
			const dateA = a.resolvedAt ? new Date(a.resolvedAt) : new Date(a.createdAt!);
			const dateB = b.resolvedAt ? new Date(b.resolvedAt) : new Date(b.createdAt!);
			return dateB.getTime() - dateA.getTime();
		})
		.slice(0, 3);

	return (
		<div className="space-y-2">
			{recentActivity.map((bug, index) => (
				<motion.div key={bug.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1 }} className="flex items-center gap-2 text-sm">
					{bug.resolvedAt ? <CheckCircleIcon className="h-4 w-4 text-green-500" /> : <AlertTriangleIcon className="h-4 w-4 text-amber-500" />}
					<span className="flex-1 truncate">{bug.title}</span>
					<span className="text-xs text-muted-foreground">{formatDate(new Date(bug.resolvedAt || bug.createdAt!))}</span>
				</motion.div>
			))}
		</div>
	);
};

export default function Dashboard() {
	const bugs = useBugStore((s) => s.bugs);
	const activeBugs = bugs.filter((bug) => bug.active);
	const squashedBugs = bugs.filter((bug) => !bug.active);
	const [stats, setStats] = useState({
		active: 0,
		squashed: 0,
		totalBounty: 0,
		resolutionRate: 0,
	});
	const navigate = useNavigate();

	const activeBountyTotal = calculateTotalBounty(activeBugs);
	const squashedBountyTotal = calculateTotalBounty(squashedBugs);

	// Find highest bounty bug
	const highestBountyBug = bugs.length > 0 ? bugs.reduce((prev, current) => (prev.bounty > current.bounty ? prev : current)) : null;

	// Animated counter effect
	useEffect(() => {
		const resolutionRate = bugs.length > 0 ? (squashedBugs.length / bugs.length) * 100 : 0;

		// Animate the counters from 0 to their actual values
		const timer = setTimeout(() => {
			setStats({
				active: activeBugs.length,
				squashed: squashedBugs.length,
				totalBounty: activeBountyTotal + squashedBountyTotal,
				resolutionRate: resolutionRate,
			});
		}, 300);

		return () => clearTimeout(timer);
	}, [bugs, activeBugs, squashedBugs, activeBountyTotal, squashedBountyTotal]);

	/* 3-D border helpers with enhanced styles */
	const raised = "border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500 shadow-sm";
	const sunken = "border-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white shadow-inner";

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
			{/* Header with title and date */}
			<div className="mb-6 flex justify-between items-start">
				<motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
					<h1 className="text-3xl font-bold mb-1">Bug Bounty Dashboard</h1>
					<p className="text-muted-foreground">
						{new Date().toLocaleDateString("en-US", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
				</motion.div>

				<motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
					<Button className={`${raised} bg-[#C0C0C0] hover:bg-[#A0A0A0] text-black flex items-center gap-2`} onClick={() => navigate("/bug/new")}>
						<BugIcon className="h-4 w-4" />
						File a Bug
					</Button>
				</motion.div>
			</div>

			{/* Top stats */}
			<div className="grid gap-6 md:grid-cols-3 mb-6">
				<motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
					<Card className={`bg-[#E0E0E0] ${raised} hover:${sunken} transition-all overflow-hidden`}>
						<div className="absolute -right-3 -top-3 h-16 w-16 bg-amber-100 rounded-full opacity-40"></div>
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2">
								<AlertTriangleIcon className="h-5 w-5 text-amber-500" />
								Active Bugs
							</CardTitle>
							<CardDescription>Current unresolved bugs</CardDescription>
						</CardHeader>
						<CardContent>
							<motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} className="text-3xl font-bold">
								{stats.active}
							</motion.div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
					<Card className={`bg-[#E0E0E0] ${raised} hover:${sunken} transition-all overflow-hidden`}>
						<div className="absolute -right-3 -top-3 h-16 w-16 bg-green-100 rounded-full opacity-40"></div>
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2">
								<CheckCircleIcon className="h-5 w-5 text-green-500" />
								Squashed Bugs
							</CardTitle>
							<CardDescription>Successfully resolved bugs</CardDescription>
						</CardHeader>
						<CardContent>
							<motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} className="text-3xl font-bold">
								{stats.squashed}
							</motion.div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
					<Card className={`bg-[#E0E0E0] ${raised} hover:${sunken} transition-all overflow-hidden`}>
						<div className="absolute -right-3 -top-3 h-16 w-16 bg-blue-100 rounded-full opacity-40"></div>
						<CardHeader className="pb-2">
							<CardTitle className="flex items-center gap-2">
								<CrownIcon className="h-5 w-5 text-blue-500" />
								Total Bounty
							</CardTitle>
							<CardDescription>Available + paid bounties</CardDescription>
						</CardHeader>
						<CardContent>
							<motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} className="text-3xl font-bold">
								${stats.totalBounty}
							</motion.div>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			{/* Middle section - stats & charts */}
			<div className="grid gap-6 md:grid-cols-3 mb-6">
				<Card className={`bg-[#E0E0E0] ${raised} md:col-span-1`}>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TargetIcon className="h-5 w-5 text-purple-500" />
							Resolution Progress
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span>{stats.resolutionRate.toFixed(1)}% Complete</span>
								<span>
									{squashedBugs.length}/{bugs.length} Bugs
								</span>
							</div>
							<motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 0.5 }}>
								<Progress value={stats.resolutionRate} className="h-2" />
							</motion.div>
						</div>
					</CardContent>
				</Card>

				<Card className={`bg-[#E0E0E0] ${raised}`}>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AreaChartIcon className="h-5 w-5 text-indigo-500" />
							Bug Priority Distribution
						</CardTitle>
					</CardHeader>
					<CardContent>
						<PriorityChart bugs={activeBugs} />
						<div className="flex justify-between mt-2 text-xs">
							<span className="flex items-center">
								<span className="h-2 w-2 bg-red-500 rounded-full mr-1"></span>
								High
							</span>
							<span className="flex items-center">
								<span className="h-2 w-2 bg-amber-500 rounded-full mr-1"></span>
								Medium
							</span>
							<span className="flex items-center">
								<span className="h-2 w-2 bg-blue-500 rounded-full mr-1"></span>
								Low
							</span>
						</div>
					</CardContent>
				</Card>

				<Card className={`bg-[#E0E0E0] ${raised}`}>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ZapIcon className="h-5 w-5 text-amber-500" />
							Recent Activity
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ActivityTimeline bugs={bugs} />
					</CardContent>
				</Card>
			</div>

			<BugTrendsChart bugs={bugs} />

			{/* Top row stats */}
			<div className="grid gap-6 md:grid-cols-2 mb-6">
				<motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
					<Card className={`bg-[#E0E0E0] ${raised} h-full`}>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<TrendingUpIcon className="h-5 w-5 text-indigo-500" />
								Highest Bounty
							</CardTitle>
						</CardHeader>
						<CardContent>
							{highestBountyBug ? (
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<motion.span whileHover={{ scale: 1.05 }} className="font-medium">
											{highestBountyBug.title}
										</motion.span>
										<Badge variant="outline" className="bg-green-100 font-semibold">
											${highestBountyBug.bounty}
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground">{highestBountyBug.description}</p>
									<div className="pt-2 flex justify-between items-center">
										<Badge
											variant="secondary"
											className={`${highestBountyBug.priority === "high" ? "bg-red-100" : highestBountyBug.priority === "medium" ? "bg-amber-100" : "bg-blue-100"}`}
										>
											{highestBountyBug.priority} priority
										</Badge>
										<Button size="sm" className="bg-[#C0C0C0] hover:bg-[#A0A0A0] text-black">
											View details
										</Button>
									</div>
								</div>
							) : (
								<p>No bugs available</p>
							)}
						</CardContent>
					</Card>
				</motion.div>

				<motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
					<Card className={`bg-[#E0E0E0] ${raised} h-full`}>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<RocketIcon className="h-5 w-5 text-pink-500" />
								Bug Insights
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-4">
								<div className="border rounded p-3 flex flex-col items-center justify-center bg-white/50">
									<BugIcon className="h-6 w-6 mb-1 text-amber-500" />
									<span className="text-lg font-semibold">{Math.round(activeBountyTotal / (activeBugs.length || 1))}</span>
									<span className="text-xs text-muted-foreground text-center">Avg. Bounty</span>
								</div>
								<div className="border rounded p-3 flex flex-col items-center justify-center bg-white/50">
									<TimerIcon className="h-6 w-6 mb-1 text-blue-500" />
									<span className="text-lg font-semibold">{activeBugs.filter((b) => b.priority === "high").length}</span>
									<span className="text-xs text-muted-foreground text-center">High Priority</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			{/* Tabbed bug lists */}
			<motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
				<Tabs defaultValue="active" className="mb-6">
					<TabsList className={`mb-4 bg-[#C0C0C0]/80 p-1 w-full justify-start ${raised}`}>
						<TabsTrigger value="active" className="data-[state=active]:bg-[#E0E0E0] data-[state=active]:text-black px-4 py-1">
							Active Bugs
						</TabsTrigger>
						<TabsTrigger value="squashed" className="data-[state=active]:bg-[#E0E0E0] data-[state=active]:text-black px-4 py-1">
							Squashed Bugs
						</TabsTrigger>
					</TabsList>

					<TabsContent value="active">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{activeBugs.map((bug, index) => (
								<motion.div key={bug.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ scale: 1.02 }}>
									<Card className={`bg-[#E0E0E0] ${raised} hover:${sunken} transition-all h-full`}>
										<CardHeader className="pb-2">
											<CardTitle className="flex justify-between items-start">
												<span>{bug.title}</span>
												<Badge variant="outline" className="ml-2 bg-green-100 font-semibold">
													${bug.bounty}
												</Badge>
											</CardTitle>
											{bug.priority && (
												<Badge
													variant="outline"
													className={`${
														bug.priority === "high"
															? "text-red-500 border-red-500"
															: bug.priority === "medium"
															? "text-amber-500 border-amber-500"
															: "text-blue-500 border-blue-500"
													}`}
												>
													{bug.priority}
												</Badge>
											)}
										</CardHeader>
										<CardContent>
											<p className="text-sm">{bug.description}</p>
											{bug.createdAt && (
												<div className="flex items-center text-xs text-muted-foreground mt-2">
													<CalendarIcon className="mr-1 h-3 w-3" />
													Reported: {formatDate(new Date(bug.createdAt))}
												</div>
											)}
										</CardContent>
										<CardFooter className="flex justify-between">
											<Badge variant="secondary" className="text-xs">
												ID: {bug.id}
											</Badge>
											{bug.assignee && (
												<Badge variant="outline" className="text-xs">
													{bug.assignee}
												</Badge>
											)}
										</CardFooter>
									</Card>
								</motion.div>
							))}
						</div>
					</TabsContent>

					<TabsContent value="squashed">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{squashedBugs.map((bug, index) => (
								<motion.div key={bug.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ scale: 1.02 }}>
									<Card className={`bg-[#E0E0E0] ${raised} hover:${sunken} transition-all h-full`}>
										<CardHeader className="pb-2">
											<CardTitle className="flex justify-between items-start">
												<span>{bug.title}</span>
												<Badge variant="outline" className="ml-2 bg-gray-100 font-semibold">
													${bug.bounty}
												</Badge>
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm">{bug.description}</p>
											{bug.resolvedAt && (
												<div className="flex items-center text-xs text-muted-foreground mt-2">
													<CheckCircleIcon className="mr-1 h-3 w-3 text-green-500" />
													Resolved: {formatDate(new Date(bug.resolvedAt))}
												</div>
											)}
										</CardContent>
										<CardFooter className="flex justify-between items-center">
											<Badge className="bg-green-100 text-green-800 hover:bg-green-200">Squashed</Badge>
											<Badge variant="secondary" className="ml-2 text-xs">
												ID: {bug.id}
											</Badge>
										</CardFooter>
									</Card>
								</motion.div>
							))}
						</div>
					</TabsContent>
				</Tabs>
			</motion.div>
		</motion.div>
	);
}
