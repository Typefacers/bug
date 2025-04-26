import { Bug } from "../types/bug";
import BugCrawler from "./BugCrawler";
import { useRef, useEffect, useState } from "react";

interface BugAreaProps {
	bugs: Bug[];
}

const BugArea = (props: BugAreaProps) => {
	const { bugs } = props;
	const containerRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	// Update dimensions on mount and resize
	useEffect(() => {
		const updateDimensions = () => {
			if (containerRef.current) {
				setDimensions({
					width: containerRef.current.offsetWidth,
					height: containerRef.current.offsetHeight
				});
			}
		};

		updateDimensions();
		window.addEventListener('resize', updateDimensions);
		
		// Add small delay to ensure dimensions are correct after DOM updates
		const timeoutId = setTimeout(updateDimensions, 100);
		
		return () => {
			window.removeEventListener('resize', updateDimensions);
			clearTimeout(timeoutId);
		};
	}, []);

	// Generate random positions for each bug within the container
	const bugPositions = bugs.map(bug => ({
		x: Math.random() * (dimensions.width || 300),
		y: Math.random() * (dimensions.height || 300)
	}));

	return (
		<div ref={containerRef} className="relative w-full h-full">
			<div className="absolute inset-0 overflow-hidden">
				{bugs.map((bug, index) => (
					<BugCrawler
						key={bug.id}
						bug={bug}
						x={bugPositions[index].x}
						y={bugPositions[index].y}
						containerWidth={dimensions.width}
						containerHeight={dimensions.height}
					/>
				))}
			</div>
		</div>
	);
};

export default BugArea;
