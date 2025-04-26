import { useBugStore } from '../store';
import { UserRow } from '../components/UserRow';

export default function Leaderboard() {
  const users = useBugStore((s) => s.users);

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Leaderboard</h1>
      <div className="space-y-2">
        {users.map((u, i) => (
          <UserRow key={u.id} user={u} index={i} />
        ))}
      </div>
    </main>
  );
} 