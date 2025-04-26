import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

// Different leaf shapes
const LeafShape: React.FC<{ type: number }> = ({ type }) => {
	const shapes = [
		// Circular leaf
		<circle cx="8" cy="8" r="6" fill="#22c55e" />,
		// Oval leaf
		<ellipse cx="8" cy="8" rx="7" ry="5" fill="#22c55e" />,
		// Maple leaf shape (simplified)
		<path d="M8,2 L10,6 L14,8 L10,10 L8,14 L6,10 L2,8 L6,6 Z" fill="#22c55e" />,
		// Heart shaped leaf
		<path d="M8,14 C8,14 14,8 14,4 C14,2 12,1 10,3 C9,4 8,5 8,5 C8,5 7,4 6,3 C4,1 2,2 2,4 C2,8 8,14 8,14 Z" fill="#22c55e" />,
	];

	return (
		<svg width="16" height="16" viewBox="0 0 16 16">
			{shapes[type % shapes.length]}
		</svg>
	);
};

// Leaf component for animation
const Leaf: React.FC<{ delay: number; x: number; y: number; rotation: number; size: number; type: number }> = ({ delay, x, y, rotation, size, type }) => {
	return (
		<motion.div
			className="absolute"
			style={{ width: size, height: size }}
			initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
			animate={{
				opacity: [0, 1, 0],
				scale: [0, 1, 0.5],
				x: [0, x],
				y: [0, y],
				rotate: [0, rotation],
			}}
			transition={{
				duration: 2,
				delay: delay,
				ease: "easeOut",
			}}
		>
			<LeafShape type={type} />
		</motion.div>
	);
};

// Wind particle component
const WindParticle: React.FC<{ delay: number; x: number; y: number }> = ({ delay, x, y }) => {
	return (
		<motion.div
			className="absolute h-0.5 rounded-full bg-indigo-300 opacity-20 dark:bg-indigo-400"
			style={{ width: Math.random() * 30 + 10 }}
			initial={{ opacity: 0, x: 0, y: 0 }}
			animate={{
				opacity: [0, 0.3, 0],
				x: [0, x],
				y: [0, y],
			}}
			transition={{
				duration: 1.5,
				delay: delay,
				ease: "easeOut",
			}}
		/>
	);
};

type ParticleType = {
	id: number;
	type: "leaf" | "wind";
	x: number;
	y: number;
	delay: number;
	rotation?: number;
	size?: number;
	leafType?: number;
};

const DarkModeToggle: React.FC = () => {
	const { isDarkMode, toggleDarkMode } = useTheme();
	const [isAnimating, setIsAnimating] = useState(false);
	const [particles, setParticles] = useState<ParticleType[]>([]);

	const handleToggle = () => {
		if (!isDarkMode) {
			// Only animate when going to dark mode
			setIsAnimating(true);

			// Create random leaves and wind particles
			const newParticles: ParticleType[] = [];

			// Add leaves
			for (let i = 0; i < 15; i++) {
				newParticles.push({
					id: i,
					type: "leaf" as const,
					x: (Math.random() - 0.5) * 300,
					y: (Math.random() - 0.5) * 300,
					delay: Math.random() * 0.5,
					rotation: Math.random() * 360,
					size: Math.random() * 10 + 15,
					leafType: Math.floor(Math.random() * 4),
				});
			}

			// Add wind particles
			for (let i = 15; i < 30; i++) {
				newParticles.push({
					id: i,
					type: "wind" as const,
					x: Math.random() * 200 + 100,
					y: (Math.random() - 0.5) * 200,
					delay: Math.random() * 0.8,
				});
			}

			setParticles(newParticles);

			// Reset animation state after animation completes
			setTimeout(() => {
				setIsAnimating(false);
				setParticles([]);
			}, 3000);
		}

		toggleDarkMode();
	};

	return (
		<div className="relative">
			<button
				onClick={handleToggle}
				className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-xl shadow-md transition-all duration-300 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-yellow-300 dark:hover:bg-indigo-800"
				aria-label="Toggle dark mode"
			>
				{isDarkMode ? "🌙" : "☀️"}
			</button>

			{/* Overlay effect */}
			<AnimatePresence>
				{isAnimating && (
					<motion.div
						className="fixed left-0 top-0 z-0 h-screen w-screen bg-gradient-to-b from-transparent to-indigo-900/10 dark:to-indigo-900/30"
						initial={{ opacity: 0 }}
						animate={{ opacity: [0, 0.5, 0.2] }}
						exit={{ opacity: 0 }}
						transition={{ duration: 2 }}
					/>
				)}
			</AnimatePresence>

			{/* Particles container */}
			<div className="fixed left-0 top-0 z-0 h-screen w-screen overflow-hidden pointer-events-none">
				{/* Particles animation */}
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					{particles.map((particle) =>
						particle.type === "leaf" ? (
							<Leaf key={particle.id} delay={particle.delay!} x={particle.x} y={particle.y} rotation={particle.rotation!} size={particle.size!} type={particle.leafType!} />
						) : (
							<WindParticle key={particle.id} delay={particle.delay} x={particle.x} y={particle.y} />
						)
					)}
				</div>
			</div>

			{/* Moon/Sun animation */}
			<AnimatePresence mode="wait">
				<motion.div
					key={isDarkMode ? "moon" : "sun"}
					className="pointer-events-none fixed left-0 top-0 z-0 flex h-full w-full items-center justify-center"
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: [0, 5, 1], opacity: [0, 0.5, 0] }}
					exit={{ scale: 0, opacity: 0 }}
					transition={{ duration: 1 }}
				>
					<div className={`h-12 w-12 rounded-full ${isDarkMode ? "bg-indigo-300" : "bg-yellow-300"}`} />
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default DarkModeToggle;
