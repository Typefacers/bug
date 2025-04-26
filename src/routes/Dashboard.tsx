import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useBugStore } from "../store";
import { Bug } from "../types/bug";
import { Badge } from "../components/ui/badge";

// Helper function to calculate total bounty
const calculateTotalBounty = (bugs: Bug[]): number => {
	return bugs.reduce((total, bug) => total + bug.bounty, 0);
};

export default function Dashboard() {
	const bugs = useBugStore((s) => s.bugs);
	const activeBugs = bugs.filter((bug) => bug.active);
	const squashedBugs = bugs.filter((bug) => !bug.active);

	const activeBountyTotal = calculateTotalBounty(activeBugs);
	const squashedBountyTotal = calculateTotalBounty(squashedBugs);

	return (
		<div className="container mx-auto p-6">
			<h1 className="mb-6 text-3xl font-bold">Bug Dashboard</h1>

			<div className="grid gap-6 md:grid-cols-3 mb-6">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle>Active Bugs</CardTitle>
						<CardDescription>Current unresolved bugs</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{activeBugs.length}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle>Squashed Bugs</CardTitle>
						<CardDescription>Successfully resolved bugs</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{squashedBugs.length}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle>Total Bounty</CardTitle>
						<CardDescription>Available + paid bounties</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">${activeBountyTotal + squashedBountyTotal}</div>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="active">
				<TabsList className="mb-4">
					<TabsTrigger value="active">Active Bugs</TabsTrigger>
					<TabsTrigger value="squashed">Squashed Bugs</TabsTrigger>
				</TabsList>

				<TabsContent value="active">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{activeBugs.map((bug) => (
							<Card key={bug.id}>
								<CardHeader>
									<CardTitle className="flex justify-between items-start">
										<span>{bug.title}</span>
										<Badge variant="outline" className="ml-2 bg-green-100">
											${bug.bounty}
										</Badge>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p>{bug.description}</p>
								</CardContent>
								<CardFooter>
									<Badge variant="secondary">ID: {bug.id}</Badge>
								</CardFooter>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="squashed">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{squashedBugs.map((bug) => (
							<Card key={bug.id}>
								<CardHeader>
									<CardTitle className="flex justify-between items-start">
										<span>{bug.title}</span>
										<Badge variant="outline" className="ml-2 bg-gray-100">
											${bug.bounty}
										</Badge>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p>{bug.description}</p>
								</CardContent>
								<CardFooter>
									<Badge>Squashed</Badge>
									<Badge variant="secondary" className="ml-2">
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
