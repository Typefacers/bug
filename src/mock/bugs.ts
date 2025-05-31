import type { Bug } from '../types/bug.ts'

// Helper to create dates in the past (days ago)
const daysAgo = (days: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

export const bugs: Bug[] = [
  {
    id: 'b1',
    title: 'Safari Login Face-Plant',
    description:
      'Safari rage-quits the instant you press "Log In."  It just nopes out.',
    bounty: 200,
    pto: Infinity,
    active: true,
    createdAt: daysAgo(6),
    priority: 'high',
  },
  {
    id: 'b2',
    title: 'Quantum Loading Spinner',
    description:
      'Loader spins so long we suspect it entered a parallel universe.',
    bounty: 80,
    pto: Infinity,
    active: true,
    createdAt: daysAgo(6),
    priority: 'medium',
  },
  {
    id: 'b3',
    title: 'Dark-mode Flashbang',
    description:
      'Blasts a full-screen white flash before night-theme.  Vampires displeased.',
    bounty: 50,
    pto: Infinity,
    active: true,
    createdAt: daysAgo(5),
    priority: 'low',
  },
  {
    id: 'b4',
    title: 'Emoji Implosion',
    description:
      'Sending a single 🐙 turns the whole chat thread into hieroglyphics.',
    bounty: 120,
    pto: Infinity,
    active: true,
    createdAt: daysAgo(5),
    priority: 'medium',
  },
  {
    id: 'b5',
    title: 'Scroll-Jacking Jitters',
    description:
      'Page politely scrolls to the top every 42 seconds (Douglas Adams approves).',
    bounty: 70,
    pto: Infinity,
    active: true,
    createdAt: daysAgo(4),
    priority: 'low',
  },
  {
    id: 'b6',
    title: 'Heisenbug',
    description:
      'Disappears the moment DevTools is open, reappears when you glance away.',
    bounty: 150,
    pto: Infinity,
    active: true,
    createdAt: daysAgo(3),
    priority: 'high',
  },
  {
    id: 'b7',
    title: 'Cache Me Outside',
    description: 'Old avatar refuses to leave—cache is just vibing.',
    bounty: 60,
    pto: Infinity,
    active: true,
    createdAt: daysAgo(2),
    priority: 'low',
  },
  {
    id: 'b8',
    title: 'CSS Houdini',
    description: 'Button makes a great escape by floating off-screen on hover.',
    bounty: 90,
    pto: Infinity,
    active: true,
    createdAt: daysAgo(1),
    priority: 'medium',
  },
  {
    id: 'b9',
    title: 'Modal Soul-Trap',
    description:
      'Modal opens, close button missing… gamers call it a soft-lock.',
    bounty: 110,
    pto: Infinity,
    active: true,
    createdAt: daysAgo(1),
    priority: 'medium',
  },
  {
    id: 'b10',
    title: 'Phantom Push @ 3 AM',
    description:
      'Users receive a push saying "…" at 3 AM.  Spooky season, every season.',
    bounty: 130,
    pto: Infinity,
    active: true,
    createdAt: daysAgo(0),
    priority: 'high',
  },
  {
    id: 'b11',
    title: 'Coffee Overflow',
    description:
      'Repeated coffee orders slowly chew through memory until the app crashes.',
    bounty: 75,
    pto: Infinity,
    active: true,
    createdAt: daysAgo(0),
    priority: 'medium',
  },
]
