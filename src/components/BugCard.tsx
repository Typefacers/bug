import { motion } from "framer-motion";
import { Bug } from "../types/bug";
import { useBugStore } from "../store";
import clsx from "clsx";
import { getBugImage } from "../utils/utils";

interface Props {
  bug: Bug;
  preview?: boolean;
}

export const BugCard: React.FC<Props> = ({ bug, preview = false }) => {
  const squashBug = useBugStore((s) => s.squashBug);
  const bugImage = getBugImage(bug.id);

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      whileTap={{ scale: 0.95, rotate: -5 }}
      className={clsx(
        "relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition",
        !bug.active && "opacity-40 grayscale",
		preview && "w-[200px]"
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
        >
          <span className="text-2xl font-bold text-red-500 transform -rotate-12 border-4 border-red-500 px-4 py-1 rounded-lg">
            SQUASHED
          </span>
        </motion.div>
      )}

      <div className="flex flex-col items-start">
        <div className="flex-1"></div>
        {!preview && <img
          src={bugImage}
          alt="Bug"
          className="h-full w-full object-cover aspect-square mb-2"
        />}
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
