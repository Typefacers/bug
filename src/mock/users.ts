export interface User {
	id: string;
	name: string;
	score: number;
	bugsSquashed: string[]; // Array of bug IDs that the user has squashed
}

export const users: User[] = [
	{
		id: "u1",
		name: "Altruistic Koala",
		score: 102_580,
		bugsSquashed: ["b11", "b12", "b13", "b14", "b15"],
	},
	{
		id: "u2",
		name: "Green Bee",
		score: 2_300,
		bugsSquashed: ["b16", "b17"],
	},
	{
		id: "u3",
		name: "Amazing Oyster",
		score: 230,
		bugsSquashed: ["b18"],
	},
];
