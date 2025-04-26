import { motion } from "framer-motion";
import { Bug } from "../types/bug";
import { useBugStore } from "../store";
import clsx from "clsx";
import cockroachImg from "../assets/cockroach-min.png";
import flyImg from "../assets/fly-min.png";
import ladybugImg from "../assets/ladybug-min.png";
import spiderImg from "../assets/spider-min.png";
import antImg from "../assets/ant-min.png";
import beetleImg from "../assets/beetle-min.png";
import caterpillarImg from "../assets/caterpillar-min.png";
import mothImg from "../assets/moth-min.png";
import beeImg from "../assets/profile-bee.png";
import ladybugImg2 from "../assets/profile-ladybug.png";

interface Props {
  bug: Bug;
}

// Array of all bug images
const bugImages = [
  ladybugImg2,
  mothImg,
  cockroachImg,
  flyImg,
  ladybugImg,
  spiderImg,
  antImg,
  beetleImg,
  caterpillarImg,
  beeImg,
];

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
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      whileTap={{ scale: 0.95, rotate: -5 }}
      className={clsx(
        "relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition",
        !bug.active && "opacity-40 grayscale"
      )}
      onClick={() => bug.active && squashBug(bug.id)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {!bug.active && (
        <motion.div
          className="absolute inset-0 bg-red-500/10 flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <motion.span 
            className="text-4xl font-extrabold text-white px-4 py-1 tracking-wider uppercase font-serif drop-shadow-[0_0_8px_rgba(255,0,0,0.7)]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
          >
            SQUASHED
          </motion.span>
        </motion.div>
      )}

      <div className="flex flex-col items-start">
        <div className="flex-1"></div>
        <img
          src={bugImage}
          alt="Bug"
          className="h-full w-full object-cover aspect-square mb-2"
        />
        <div className="flex items-center  m-2">
          <h3 className="flex items-center text-xl font-semibold">
            {bug.title}
          </h3>
          <span className="ml-2 inline-block rounded-full bg-emerald-600 px-2 py-1 text-xs font-mono text-white">
            +{bug.bounty}
          </span>
        </div>
        <p className="my-4 mx-2 mt-1 text-sm text-gray-600">{bug.description}</p>
      </div>
    </motion.div>
  );
};
