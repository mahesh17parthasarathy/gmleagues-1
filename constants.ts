
import { Group } from './types';
import type { Team } from './types';

const teamNames = [
  "TEAM X AURA ACES", "RV SQUAD", "V CHAMPS", "NAMMA RIVALS", "RK GAMING",
  "Godlike Esports", "Team Soul", "TSM Entity", "Fnatic", "Orange Rock",
  "Galaxy Racer", "Scout's Team", "Hydra Official", "Blind Esports", "Global Esports",
  "8bit", "Chemin Esports", "Revenant Esports", "Skylightz Gaming", "Team Insane"
];

const createTeam = (id: number, name: string): Team => ({
  id,
  rank: 0,
  name,
  matchesPlayed: 0,
  wins: 0,
  losses: 0,
  roundsWon: 0,
  placementPoints: 0,
  killPoints: 0,
  totalPoints: 0,
});

export const INITIAL_GROUPS: Group[] = [
  {
    id: 'group-a',
    name: 'Group A',
    teams: teamNames.slice(0, 5).map((name, index) => createTeam(index + 1, name)),
  },
  {
    id: 'group-b',
    name: 'Group B',
    teams: teamNames.slice(5, 10).map((name, index) => createTeam(index + 6, name)),
  },
  {
    id: 'group-c',
    name: 'Group C',
    teams: teamNames.slice(10, 15).map((name, index) => createTeam(index + 11, name)),
  },
  {
    id: 'group-d',
    name: 'Group D',
    teams: teamNames.slice(15, 20).map((name, index) => createTeam(index + 16, name)),
  },
];
