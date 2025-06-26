export interface SeatPosition {
  user: User;
  side: "A" | "B" | "C" | "D";
  position: number;
  totalOnSide: number;
}

export interface User {
  id: number;
  name: string;
  userId: string;
  voted: boolean;
  vote: number | string | null;
  isCurrentUser: boolean;
}