import { Seats } from "../seats";
import { TableContainer } from "./index.styled";

interface VoteData {
  userId: string;
  value: string;
  timestamp: Date;
}

interface Participant {
  userId: string;
  username: string;
}

interface TableProps {
  votes: VoteData[];
  isRevealed: boolean;
  participants: Participant[];
  currentUserId?: string;
}

export const Table = ({ votes, isRevealed, participants, currentUserId }: TableProps) => {
  console.log('participants', participants);
  return (
    <TableContainer>
      <Seats 
        votes={votes}
        isRevealed={isRevealed}
        participants={participants}
        currentUserId={currentUserId}
      />
    </TableContainer>
  );
};
