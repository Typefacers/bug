import { create } from "zustand";
import { bugs as mockBugs } from "./mock/bugs";
import { users as mockUsers } from "./mock/users";
import { Bug } from "./types/bug";

interface State {
	bugs: Bug[];
	users: any[]; // Using any for now since we don't have the exact User type
	activeUserId: string;
	inspectedId: string | null;
	inspectBug: (id: string) => void;
	squashBug: (id: string) => void;
}

export const useBugStore = create<State>((set) => ({
	bugs: mockBugs,
	users: mockUsers.sort((a, b) => b.bounty - a.bounty),
	activeUserId: "u1", // assume first user is the current hacker
	inspectedId: null,
	inspectBug: (id) => set({ inspectedId: id }),
	squashBug: (id) =>
		set((state) => {
			// mark bug inactive + award bounty
			let updatedBug: Bug | undefined;
			const bugs = state.bugs.map((b) => {
				if (b.id === id && b.active) {
					updatedBug = { ...b, active: false };
					return updatedBug;
				}
				return b;
			});

			const users = updatedBug
				? state.users
						.map((u) =>
							u.id === state.activeUserId
								? {
										...u,
										score: (u.score || 0) + (updatedBug!.bounty || 0),
										bugsSquashed: [...(u.bugsSquashed || []), updatedBug!.id],
								  }
								: u
						)
						.sort((a, b) => (b.score || b.bounty) - (a.score || a.bounty))
				: state.users;

			return { bugs, users, inspectedId: null };
		}),
}));
