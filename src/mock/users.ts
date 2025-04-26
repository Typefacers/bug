export interface User {
  id: string;
  name: string;
  score: number;
}

export const users: User[] = [
  { id: 'u1', name: 'Altruistic Koala', score: 102_300 },
  { id: 'u2', name: 'Green Bee', score: 2_300 },
  { id: 'u3', name: 'Amazing Oyster', score: 230 },
]; 