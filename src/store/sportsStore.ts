import { create } from 'zustand';

export type MatchStatus = 'live' | 'upcoming' | 'finished';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minute?: number;
  league: string;
  leagueLogo: string;
  homeLogo: string;
  awayLogo: string;
  kickoff?: string;
  events?: MatchEvent[];
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  player: string;
  team: 'home' | 'away';
}

interface SportsStore {
  matches: Match[];
  selectedLeague: string | null;
  isRefreshing: boolean;
  setSelectedLeague: (league: string | null) => void;
  refreshMatches: () => void;
  simulateLive: () => void;
}

const mockMatches: Match[] = [
  {
    id: '1', homeTeam: 'Manchester City', awayTeam: 'Arsenal', homeScore: 2, awayScore: 1,
    status: 'live', minute: 67, league: 'Premier League', leagueLogo: 'epl',
    homeLogo: 'mancity', awayLogo: 'arsenal',
    events: [
      { minute: 23, type: 'goal', player: 'Haaland', team: 'home' },
      { minute: 41, type: 'goal', player: 'Saka', team: 'away' },
      { minute: 55, type: 'goal', player: 'De Bruyne', team: 'home' },
      { minute: 62, type: 'yellow_card', player: 'White', team: 'away' },
    ],
  },
  {
    id: '2', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', homeScore: 0, awayScore: 0,
    status: 'live', minute: 34, league: 'La Liga', leagueLogo: 'laliga',
    homeLogo: 'barcelona', awayLogo: 'realmadrid', events: [],
  },
  {
    id: '3', homeTeam: 'Bayern Munich', awayTeam: 'Dortmund', homeScore: 0, awayScore: 0,
    status: 'upcoming', league: 'Bundesliga', leagueLogo: 'bundesliga',
    homeLogo: 'bayern', awayLogo: 'dortmund', kickoff: '18:30',
  },
  {
    id: '4', homeTeam: 'PSG', awayTeam: 'Lyon', homeScore: 3, awayScore: 1,
    status: 'finished', league: 'Ligue 1', leagueLogo: 'ligue1',
    homeLogo: 'psg', awayLogo: 'lyon', events: [],
  },
  {
    id: '5', homeTeam: 'Juventus', awayTeam: 'Inter Milan', homeScore: 1, awayScore: 2,
    status: 'finished', league: 'Serie A', leagueLogo: 'seriea',
    homeLogo: 'juve', awayLogo: 'inter', events: [],
  },
  {
    id: '6', homeTeam: 'Chelsea', awayTeam: 'Liverpool', homeScore: 0, awayScore: 0,
    status: 'upcoming', league: 'Premier League', leagueLogo: 'epl',
    homeLogo: 'chelsea', awayLogo: 'liverpool', kickoff: '20:00',
  },
];

export const useSportsStore = create<SportsStore>((set, get) => ({
  matches: mockMatches,
  selectedLeague: null,
  isRefreshing: false,
  setSelectedLeague: (league) => set({ selectedLeague: league }),
  refreshMatches: () => {
    set({ isRefreshing: true });
    setTimeout(() => set({ isRefreshing: false }), 1000);
  },
  simulateLive: () => {
    set((state) => ({
      matches: state.matches.map((m) =>
        m.status === 'live' ? { ...m, minute: Math.min((m.minute ?? 0) + 1, 90) } : m
      ),
    }));
  },
}));
