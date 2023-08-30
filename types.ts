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
