export interface User {
  id: number;
  name: string;
  avatar: string;
  bugs: any[];
  bounty: number;
  score?: number;
  bugsSquashed?: string[];
}
