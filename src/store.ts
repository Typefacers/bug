import { create } from "zustand";
import { bugs as mockBugs } from "./mock/bugs";
import { users as mockUsers } from "./mock/users";
import { Bug } from "./types/bug";
import type { User } from "./types/user";
import { v4 as uuidv4 } from "uuid";

interface State {
        bugs: Bug[];
        users: User[];
        activeUserId: number;
        inspectedId: string | null;
        inspectBug: (id: string | null) => void;
        squashBug: (id: string) => void;
        addBug: (bug: Bug) => void;
        respawnBug: () => void;
        cleanDeadBugs: () => void;
}

export const useBugStore = create<State>((set) => ({
        bugs: mockBugs,
        users: mockUsers.sort((a, b) => b.bounty - a.bounty),
        activeUserId: 1, // assume first user is the current hacker
        inspectedId: null,
        addBug: (bug) =>
                set((state) => ({ bugs: [...state.bugs, bug] })),
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
        respawnBug: () =>
                set((state) => {
                        const id = uuidv4().substring(0, 8);
                        const priorities = ["high", "medium", "low"] as const;
                        const bug: Bug = {
                                id,
                                title: `Respawned Bug ${id}`,
                                description: "A newly respawned bug.",
                                bounty: 50 + Math.floor(Math.random() * 100),
                                active: true,
                                priority: priorities[Math.floor(Math.random() * priorities.length)],
                                createdAt: new Date().toISOString(),
                        };
                        return { bugs: [...state.bugs, bug] };
                }),
        cleanDeadBugs: () =>
                set((state) => ({ bugs: state.bugs.filter((b) => b.active) })),
}));
