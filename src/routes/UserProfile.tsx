import { useParams, Link } from "react-router-dom";
import { useBugStore } from "../store";

/* 3-D border helper */
const raised =
  "border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500";

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { users, bugs } = useBugStore();

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return (
      <div className="text-center space-y-4">
        <Link to="/bounty-leaderboard" className="text-indigo-600 hover:underline">
          Back to Leaderboard
        </Link>
      </div>
    );
  }

  /* Derived data */
  const squashedBugs = bugs.filter((bug) => user.bugsSquashed.includes(bug.id));
  const totalBounty = squashedBugs.reduce((sum, bug) => sum + bug.bounty, 0);

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className={`bg-[#E0E0E0] ${raised}`}>
        <div className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="mt-1 text-lg font-mono text-emerald-700">
              {user.score.toLocaleString()} points
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span>Total Bugs Squashed:</span>
              <span className="font-medium">{user.bugsSquashed.length}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span>Total Bounty Collected:</span>
              <span className="font-medium">{totalBounty.toLocaleString()}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span>Rank:</span>
              <span className="font-medium">
                #{users.findIndex((u) => u.id === userId) + 1}
              </span>
            </div>
          </div>
        </div>
      </div>

      {squashedBugs.length > 0 && (
        <div className={`bg-[#E0E0E0] ${raised}`}>
          <div className="p-6 space-y-2">
            <h3 className="mb-3 text-xl font-semibold">Bugs Squashed</h3>
            {squashedBugs.map((bug) => (
              <div key={bug.id} className="rounded-lg border bg-white p-3 shadow-sm">
                <div className="font-medium">{bug.title}</div>
                <div className="mt-1 text-sm text-gray-600">{bug.description}</div>
                <div className="mt-2 text-right font-mono text-emerald-700">
                  +{bug.bounty.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center">
        <Link to="/bounty-leaderboard" className="text-indigo-600 hover:underline">
          Back to Leaderboard
        </Link>
      </div>
    </div>
  );
}