import { Bug } from "../types/bug";
import BugCrawler from "./BugCrawler";

interface BugAreaProps {
	bugs: Bug[];
}

const BugArea = (props: BugAreaProps) => {
	const { bugs } = props;

	// Generate random positions for each bug
	const bugPositions = bugs.map(bug => ({
		x: Math.random() * window.innerWidth,
		y: Math.random() * window.innerHeight
	}));

	return (
		<div className="absolute inset-0 border border-red-500">
			{bugs.map((bug, index) => (
				<BugCrawler
					key={bug.id}
					bug={bug}
					x={bugPositions[index].x}
					y={bugPositions[index].y}
				/>
			))}
		</div>
	);
};

export default BugArea;

