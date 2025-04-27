import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useBugStore } from "../store";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { Bug } from "../types/bug";

export default function NewBug() {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [bounty, setBounty] = useState(50);
	const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
	const [error, setError] = useState("");

	// Get bugs from store
	const bugs = useBugStore((s) => s.bugs);
	const setBugs = useBugStore((s) => {
		// Return a function that updates the bugs array
		return (newBug: Bug) => {
			// Since we don't have an explicit addBug method in the store,
			// we can use this approach to update the bugs array directly
			useBugStore.setState({ bugs: [...bugs, newBug] });
		};
	});

	const createBug = () => {
		if (!title) {
			setError("Please enter a title for the bug");
			return;
		}

		if (!description) {
			setError("Please enter a description for the bug");
			return;
		}

		const newBug: Bug = {
			id: uuidv4().substring(0, 8),
			title,
			description,
			bounty,
			active: true,
			priority,
			createdAt: new Date().toISOString(),
		};

		setBugs(newBug);
		navigate("/dashboard");
	};

	/* 3-D border helpers with enhanced styles */
	const raised = "border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500 shadow-sm";
	const sunken = "border-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white shadow-inner";

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto">
			<Card className={`bg-[#E0E0E0] ${raised}`}>
				<CardHeader>
					<CardTitle className="text-2xl font-bold">File a New Bug</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{error && <div className={`${sunken} bg-red-100 text-red-800 p-2 text-sm`}>{error}</div>}

					<div className="space-y-1">
						<Label htmlFor="title">Bug Title</Label>
						<Input id="title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} className={`bg-white ${sunken}`} />
					</div>

					<div className="space-y-1">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
							className={`bg-white ${sunken} min-h-[100px]`}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<Label htmlFor="bounty">Bounty Amount ($)</Label>
							<Input
								id="bounty"
								type="number"
								min={10}
								value={bounty}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBounty(Number(e.target.value))}
								className={`bg-white ${sunken}`}
							/>
						</div>

						<div className="space-y-1">
							<Label htmlFor="priority">Priority</Label>
							<Select value={priority} onValueChange={(value: "high" | "medium" | "low") => setPriority(value)}>
								<SelectTrigger className={`${raised} bg-[#C0C0C0]`}>
									<SelectValue placeholder="Select priority" />
								</SelectTrigger>
								<SelectContent className={`${raised} bg-[#C0C0C0] w-full`}>
									<SelectItem value="high">high</SelectItem>
									<SelectItem value="medium">medium</SelectItem>
									<SelectItem value="low">low</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button className={`${raised} bg-[#C0C0C0] hover:bg-[#A0A0A0] text-black`} onClick={() => navigate("/dashboard")}>
						Cancel
					</Button>
					<Button className={`${raised} bg-[#008080] hover:bg-[#006666] text-white`} onClick={createBug}>
						Submit Bug
					</Button>
				</CardFooter>
			</Card>
		</motion.div>
	);
}
