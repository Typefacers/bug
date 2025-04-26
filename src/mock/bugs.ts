import { Bug } from '../types/bug';

export const bugs: Bug[] = [
  {
    id: 'b1',
    title: 'Login Crash',
    description: 'App crashes on Safari after login attempt.',
    bounty: 200,
    active: true,
  },
  {
    id: 'b2',
    title: 'Slow Image Load',
    description: 'Images load slowly on 3G.',
    bounty: 50,
    active: true,
  },
  {
    id: 'b3',
    title: 'Dark‑mode Flash',
    description: 'White flash before dark‑theme applies.',
    bounty: 50,
    active: true,
  },
]; 