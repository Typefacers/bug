import { create } from "zustand";
import { bugs as mockBugs } from "./mock/bugs";
import { users as mockUsers, User } from "./mock/users";
import { Bug } from "./types/bug";

interface State {
	bugs: Bug[];
	users: User[];
	activeUserId: string;
	squashBug: (id: string) => void;
}

export const useBugStore = create<State>((set) => ({
	bugs: mockBugs,
	users: mockUsers.sort((a, b) => b.score - a.score),
	activeUserId: "u1", // assume first user is the current hacker
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
										score: u.score + updatedBug!.bounty,
										bugsSquashed: [...u.bugsSquashed, updatedBug!.id],
								  }
								: u
						)
						.sort((a, b) => b.score - a.score)
				: state.users;

			return { bugs, users };
		}),
}));
