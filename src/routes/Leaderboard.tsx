import Win95Window from "../components/Win95Window";
import { useBugStore } from "../store";
import { UserRow } from "../components/UserRow";

/* 3-D border helper */
const raised =
  "border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500";

export default function Leaderboard() {
  const users = useBugStore((s) => s.users);

  return (
    <Win95Window title="Bug Leaderboard">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-center text-3xl font-bold">Leaderboard</h1>

        <div className={`bg-[#E0E0E0] ${raised}`}>
          <div className="p-4 space-y-2">
            {users.map((u, i) => (
              <UserRow key={u.id} user={u} index={i} />
            ))}
          </div>
        </div>
      </div>
    </Win95Window>
  );
} 