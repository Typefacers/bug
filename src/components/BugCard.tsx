import { motion } from "framer-motion";
import { Bug } from "../types/bug";
import { useBugStore } from "../store";
import clsx from "clsx";
import { getBugImage } from "../utils/utils";

interface Props {
  bug: Bug;
  /** Compact hover preview when true */
  preview?: boolean;
}

export const BugCard: React.FC<Props> = ({ bug, preview = false }) => {
  const squashBug = useBugStore((s) => s.squashBug);
  const bugImage = getBugImage(bug.id);

  return (
    <motion.div
      whileHover={{
        y: -8,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.05)",
      }}
      whileTap={{ scale: 0.95, rotate: -3 }}
      className={clsx(
        "relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition",
        !bug.active && "opacity-40 grayscale",
        preview ? "w-[200px]" : "w-80"
      )}
      onClick={() => bug.active && squashBug(bug.id)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Overlay for squashed bugs */}
      {!bug.active && (
        <motion.div
          className="absolute inset-0 bg-red-500/20 flex items-center justify-center z-10"
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

      <div className="flex flex-col">
        {!preview && (
          <img
            src={bugImage}
            alt={bug.title}
            className="h-full w-full object-cover aspect-square mb-2"
          />
        )}

        <div className="flex items-center mx-4 mt-2">
          <h3 className="flex-1 text-xl font-semibold leading-tight">
            {bug.title}
          </h3>
          <span className="ml-2 inline-block rounded-full bg-emerald-600 px-2 py-1 text-xs font-mono text-white">
            +{bug.bounty}
          </span>
        </div>

        <p className="mb-4 mx-4 text-sm text-gray-600">{bug.description}</p>
      </div>
    </motion.div>
  );
};