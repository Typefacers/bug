import React from "react";

interface Props {
	x: number;
	y: number;
}

/** A simple red cross-hair that never intercepts pointer events. */
const AimCursor: React.FC<Props> = ({ x, y }) => {
	const size = 24;
	const half = size / 2;

	return (
		<div
			className="pointer-events-none absolute z-[100]"
			style={{
				left: x - half,
				top: y - half,
				width: size,
				height: size,
			}}
		>
			{/* outer ring */}
			<div className="absolute inset-0 rounded-full border-2 border-red-600" />
			{/* vertical line */}
			<div className="absolute top-0 bottom-0 left-1/2 w-px bg-red-600" style={{ transform: "translateX(-0.5px)" }} />
			{/* horizontal line */}
			<div className="absolute left-0 right-0 top-1/2 h-px bg-red-600" style={{ transform: "translateY(-0.5px)" }} />
		</div>
	);
};

export default AimCursor;
