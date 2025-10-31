
export interface Team {
  id: number;
  rank: number;
  name: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  roundsWon: number;
  placementPoints: number;
  killPoints: number;
  totalPoints: number;
}

export interface Group {
  id: string;
  name: string;
  teams: Team[];
}
