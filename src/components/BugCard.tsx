import { motion } from "framer-motion";
import { Bug } from "../types/bug";
import { useBugStore } from "../store";
import clsx from "clsx";
import cockroachImg from "../assets/cockroach-min.png";
import flyImg from "../assets/fly-min.png";
import ladybugImg from "../assets/ladybug-min.png";
import spiderImg from "../assets/spider-min.png";

interface Props {
	bug: Bug;
}

// Array of all bug images
const bugImages = [cockroachImg, flyImg, ladybugImg, spiderImg];

// Get a random bug image based on bug id
const getBugImage = (id: string) => {
	// Use the bug ID to consistently get the same image for the same bug
	const index = id.charCodeAt(id.length - 1) % bugImages.length;
	return bugImages[index];
};

export const BugCard: React.FC<Props> = ({ bug }) => {
	const squashBug = useBugStore((s) => s.squashBug);
	const bugImage = getBugImage(bug.id);

	return (
		<motion.div
			whileHover={{ y: -4 }}
			whileTap={{ scale: 0.95, rotate: -5 }}
			className={clsx("cursor-pointer select-none rounded-2xl border bg-white p-4 shadow transition", !bug.active && "opacity-30 line-through")}
			onClick={() => bug.active && squashBug(bug.id)}
		>
			<div className="flex items-start">
				<div className="flex-1">
					<h3 className="text-lg font-semibold">{bug.title}</h3>
					<p className="mt-1 text-sm text-gray-600">{bug.description}</p>
					<span className="mt-3 inline-block rounded-full bg-emerald-600 px-2 py-1 text-xs font-mono text-white">+{bug.bounty}</span>
				</div>
				<img src={bugImage} alt="Bug" className="ml-2 h-16 w-16 object-contain" />
			</div>
		</motion.div>
	);
};
