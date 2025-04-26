export interface Bug {
	id: string;
	title: string;
	description: string;
	bounty: number;
	active: boolean;
	priority?: "high" | "medium" | "low";
	createdAt?: string;
	resolvedAt?: string;
	assignee?: string;
}
