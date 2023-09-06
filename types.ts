export interface GamePicks {
  [week: string]: {
      [game: string]: string;
  };
}

export interface Member {
  picks: any;
  id: string;
  name: string;
}

export interface League {
  memberIds: string[];
  members: {
    [memberId: string]: Member;
  };
  name: string;
  owner: string;
}

export interface Picks {
  [week: string]: {
    [game: string]: string;
  };
}

export interface UsersPicks {
  [userId: string]: Picks;
}

export interface LeagueData {
  members: UsersPicks;
}

export interface CommonWeekProperties {
  tiebreaker: number;
}

export interface Matchup {
  time: string; 
  away: string;
  home: string;
  winner: string;
}

export interface Week {
  [gameId: string]: Matchup;
}

export interface Matchups {
  [week: string]: Week & CommonWeekProperties;
}