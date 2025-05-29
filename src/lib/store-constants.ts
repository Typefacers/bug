export const CONFIG = {
  CLEANUP_DELAY: 10000, // Remove squashed bugs after 10 seconds
  RESPAWN_INTERVAL: 3000, // Spawn new bug every 3 seconds
  MAX_ACTIVE_BUGS: 15, // Maximum number of active bugs
  MIN_ACTIVE_BUGS: 8, // Minimum number of active bugs to maintain
}

export const BUG_TEMPLATES = [
  {
    title: 'Memory Leak Monster',
    description: 'RAM consumption grows exponentially with each click.',
  },
  {
    title: 'Async Nightmare',
    description: 'Promise never resolves, callbacks lost in the void.',
  },
  {
    title: 'CSS Chaos',
    description: 'Styles randomly flip upside down on Tuesdays.',
  },
  {
    title: 'Database Disappearing Act',
    description: 'Query returns undefined for no apparent reason.',
  },
  {
    title: 'Timezone Tornado',
    description: 'Dates jump between timezones like a confused traveler.',
  },
  {
    title: 'Form Field Phantom',
    description: 'Input accepts text but data vanishes on submit.',
  },
  {
    title: 'Loading Loop Limbo',
    description: 'Spinner spins forever, user patience expires.',
  },
  {
    title: 'Cookie Crumble Crisis',
    description: 'Session data randomly evaporates mid-transaction.',
  },
  {
    title: 'Mobile Mayhem',
    description: 'App works perfectly on desktop, panics on mobile.',
  },
  {
    title: 'Error 500 Surprise',
    description: 'Server throws tantrums when processing valid requests.',
  },
]
