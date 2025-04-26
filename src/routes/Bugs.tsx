import { BugCard } from '../components/BugCard';
import { useBugStore } from '../store';

export default function Bugs() {
  const bugs = useBugStore((s) => s.bugs);

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Bug Bounty</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {bugs.map((bug) => (
          <BugCard key={bug.id} bug={bug} />
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-gray-500">
        Tap a card to squash the bug &amp; earn its bounty 👆
      </p>
    </main>
  );
} 