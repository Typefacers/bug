import { useBugStore } from "../store";
import { UserRow } from "../components/UserRow";

/* 3-D border helper */
const raised =
  "border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500";

export default function Leaderboard() {
  const users = useBugStore((s) => s.users);

  return (
    <div className="mx-auto max-w-md">
      <div className={`bg-[#E0E0E0] ${raised}`}>
        <div className="p-4 space-y-2">
          {users.map((u, i) => (
            <UserRow key={u.id} user={u} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
} 