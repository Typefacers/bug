// More authentic Win95 border colors: white/black for outer, and a mid-gray for inner if needed.
// For simple raised/sunken, it's usually white against black/dark-gray.
export const raised =
  'border-2 border-t-white border-l-white border-r-neutral-700 border-b-neutral-700'; // neutral-700 is #404040
export const sunken =
  'border-2 border-t-neutral-700 border-l-neutral-700 border-r-white border-b-white'; // Using white for the lighter part
export const windowShadow = // This seems fine, uses specific shadow values
  'shadow-[inset_-2px_-2px_0_0_rgba(0,0,0,0.55),inset_2px_2px_0_0_rgba(255,255,255,0.8)]';
