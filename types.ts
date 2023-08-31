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

export interface Matchup {
  winner: string;
  home: string;
  away: string;
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

export interface MatchupsData {
  [week: string]: {
    [game: string]: Matchup;
  };
}