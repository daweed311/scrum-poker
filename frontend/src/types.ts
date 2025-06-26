export interface Room {
  roomId: string;
  name: string;
  createdBy: string;
  participants: string[];
  votes: Record<string, any>;
  isRevealed: boolean;
  rounds: [
    {
      roundId: string;
      votes: Record<string, any>;
      isRevealed: boolean;
      createdAt: string;
      updatedAt: string;
    }
  ];
  createdAt: string;
  updatedAt: string;
}
