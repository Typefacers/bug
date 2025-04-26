import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useBugStore } from "../store";
import { Bug } from "../types/bug";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { CalendarIcon, CheckCircleIcon, AlertTriangleIcon } from "lucide-react";

// Helper function to calculate total bounty
const calculateTotalBounty = (bugs: Bug[]): number => {
	return bugs.reduce((total, bug) => total + bug.bounty, 0);
};

// Helper function to format date (assuming bugs have createdAt property)
const formatDate = (date: Date): string => {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);
};

export default function Dashboard() {
	const bugs = useBugStore((s) => s.bugs);
	const activeBugs = bugs.filter((bug) => bug.active);
	const squashedBugs = bugs.filter((bug) => !bug.active);

	const activeBountyTotal = calculateTotalBounty(activeBugs);
	const squashedBountyTotal = calculateTotalBounty(squashedBugs);

	// Calculate bug resolution rate
	const resolutionRate = bugs.length > 0 ? (squashedBugs.length / bugs.length) * 100 : 0;

	// Find highest bounty bug
	const highestBountyBug = bugs.length > 0 ? bugs.reduce((prev, current) => (prev.bounty > current.bounty ? prev : current)) : null;

	return (
		<div className="container mx-auto p-6">
			<h1 className="mb-6 text-3xl font-bold">Bug Dashboard</h1>

			<div className="grid gap-6 md:grid-cols-3 mb-6">
				<Card className="shadow-md">
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2">
							<AlertTriangleIcon className="h-5 w-5 text-amber-500" />
							Active Bugs
						</CardTitle>
						<CardDescription>Current unresolved bugs</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{activeBugs.length}</div>
					</CardContent>
				</Card>

				<Card className="shadow-md">
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2">
							<CheckCircleIcon className="h-5 w-5 text-green-500" />
							Squashed Bugs
						</CardTitle>
						<CardDescription>Successfully resolved bugs</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{squashedBugs.length}</div>
					</CardContent>
				</Card>

				<Card className="shadow-md">
					<CardHeader className="pb-2">
						<CardTitle>Total Bounty</CardTitle>
						<CardDescription>Available + paid bounties</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">${activeBountyTotal + squashedBountyTotal}</div>
					</CardContent>
				</Card>
			</div>

			{/* New statistics row */}
			<div className="grid gap-6 md:grid-cols-2 mb-6">
				<Card className="shadow-md">
					<CardHeader>
						<CardTitle>Resolution Progress</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span>{resolutionRate.toFixed(1)}% Complete</span>
								<span>
									{squashedBugs.length}/{bugs.length} Bugs
								</span>
							</div>
							<Progress value={resolutionRate} className="h-2" />
						</div>
					</CardContent>
				</Card>

				<Card className="shadow-md">
					<CardHeader>
						<CardTitle>Highest Bounty</CardTitle>
					</CardHeader>
					<CardContent>
						{highestBountyBug ? (
							<div className="space-y-2">
								<div className="flex justify-between">
									<span className="font-medium">{highestBountyBug.title}</span>
									<Badge variant="outline" className="bg-green-100 font-semibold">
										${highestBountyBug.bounty}
									</Badge>
								</div>
								<p className="text-sm text-muted-foreground">{highestBountyBug.description}</p>
							</div>
						) : (
							<p>No bugs available</p>
						)}
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="active" className="mb-6">
				<TabsList className="mb-4 bg-secondary w-full justify-start p-1">
					<TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
						Active Bugs
					</TabsTrigger>
					<TabsTrigger value="squashed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
						Squashed Bugs
					</TabsTrigger>
				</TabsList>

				<TabsContent value="active">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{activeBugs.map((bug) => (
							<Card key={bug.id} className="shadow-md hover:shadow-lg transition-shadow">
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
											className={`
											${bug.priority === "high" ? "text-red-500 border-red-500" : bug.priority === "medium" ? "text-amber-500 border-amber-500" : "text-blue-500 border-blue-500"}
										`}
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
						))}
					</div>
				</TabsContent>

				<TabsContent value="squashed">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{squashedBugs.map((bug) => (
							<Card key={bug.id} className="shadow-md hover:shadow-lg transition-shadow">
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
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
