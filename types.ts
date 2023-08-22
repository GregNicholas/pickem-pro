export interface GamePicks {
  [week: string]: {
      [game: string]: string;
  };
}

export interface Member {
  picks: GamePicks;
  id: string;
  name: string;
}

export interface League {
  name: string;
  owner: string;
  members: Member[];
  memberIds: string[];
}