import { motion } from 'framer-motion';
import { Bug } from '../types/bug';
import { useBugStore } from '../store';
import clsx from 'clsx';

interface Props {
  bug: Bug;
}

export const BugCard: React.FC<Props> = ({ bug }) => {
  const squashBug = useBugStore((s) => s.squashBug);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95, rotate: -5 }}
      className={clsx(
        'cursor-pointer select-none rounded-2xl border bg-white p-4 shadow transition',
        !bug.active && 'opacity-30 line-through',
      )}
      onClick={() => bug.active && squashBug(bug.id)}
    >
      <h3 className="flex items-center text-lg font-semibold">
        <span role="img" aria-label={bug.active ? 'bug' : 'squashed'} className="mr-1">
          {bug.active ? '🐞' : '✅'}
        </span>
        {bug.title}
      </h3>
      <p className="mt-1 text-sm text-gray-600">{bug.description}</p>
      <span className="mt-3 inline-block rounded-full bg-emerald-600 px-2 py-1 text-xs font-mono text-white">
        +{bug.bounty}
      </span>
    </motion.div>
  );
}; 