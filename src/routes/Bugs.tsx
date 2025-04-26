import Win95Window from "../components/Win95Window";
import BugArea from "../components/BugArea";
import { useBugStore } from "../store";

/* 3-D border helper */
const raised =
  "border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500";

export default function Bugs() {
  const bugs = useBugStore((s) => s.bugs);

  return (
    <Win95Window title="Bug Bounty">
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-center text-3xl font-bold">Bug Bounty</h1>

        <div className={`bg-[#E0E0E0] ${raised} p-4`}>
          <BugArea bugs={bugs} />
        </div>

        <p className="text-center text-sm text-gray-800">
          Tap a card to squash the bug &amp; earn its bounty 👆
        </p>
      </div>
    </Win95Window>
  );
}