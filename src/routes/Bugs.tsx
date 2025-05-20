import BugArea from "../components/BugArea";
import { useBugStore } from "../store";
import { raised } from "../utils/win95";

export default function Bugs() {
	const bugs = useBugStore((s) => s.bugs);

	return (
		<div className="flex flex-col h-full">
			<div className={`bg-[#E0E0E0] ${raised} p-2 flex-grow relative`} style={{ minHeight: "60vh" }}>
				<BugArea bugs={bugs} />
			</div>

			<p className="text-center text-sm text-gray-800 py-2">Click to squash a bug&nbsp;&amp;&nbsp;earn its bounty 👆</p>
		</div>
	);
}
