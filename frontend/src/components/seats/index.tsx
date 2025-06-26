import {
  SeatsContainer,
  TableContainer,
  CardPlaceholder,
} from "./index.styled";
import { Seat } from "./seat";
import { SeatsMobile } from "./seats-mobile";
import { useIsMobile } from "../../hooks";
import { AnimatedCard } from "./animated-card";
import type { User, SeatPosition } from "./types";

interface VoteData {
  userId: string;
  value: string;
  timestamp: Date;
}

interface Participant {
  userId: string;
  username: string;
}

interface SeatsProps {
  votes: VoteData[];
  isRevealed: boolean;
  participants: Participant[];
  currentUserId?: string; 
}

const convertToUsers = (votes: VoteData[], participants: Participant[], currentUserId?: string): User[] => {
  return participants.map((participant, index) => {
    const vote = votes.find(v => v.userId === participant.userId);
    return {
      id: index + 1,
      name: participant.username,
      userId: participant.userId, // Add userId to User interface
      voted: !!vote,
      vote: vote ? vote.value : null, // Always use the actual vote value
      isCurrentUser: currentUserId === participant.userId, // Add current user flag
    };
  });
};

const calculateSeatPositions = (users: User[]): SeatPosition[] => {
  const positions: SeatPosition[] = [];

  const seatingOrder: ("C" | "A" | "D" | "B")[] = ["C", "A", "D", "B"];

  const totalPlayers = users.length;
  let sideCounts = { C: 0, A: 0, D: 0, B: 0 };

  if (totalPlayers <= 4) {
    sideCounts = {
      C: Math.min(1, totalPlayers),
      A: Math.min(1, Math.max(0, totalPlayers - 1)),
      D: Math.min(1, Math.max(0, totalPlayers - 2)),
      B: Math.min(1, Math.max(0, totalPlayers - 3)),
    };
  } else if (totalPlayers <= 8) {
    sideCounts = {
      C: totalPlayers >= 6 ? 2 : 1,
      A: totalPlayers >= 5 ? 2 : 1,
      D: totalPlayers >= 7 ? 2 : 1,
      B: totalPlayers >= 8 ? 2 : 1,
    };
  } else {
    sideCounts = {
      C: totalPlayers === 10 ? 3 : 2,
      A: totalPlayers === 9 ? 3 : 3,
      D: 2,
      B: 2,
    };
  }

  let userIndex = 0;

  seatingOrder.forEach((side) => {
    const seatsOnSide = sideCounts[side];
    for (
      let position = 0;
      position < seatsOnSide && userIndex < users.length;
      position++
    ) {
      positions.push({
        user: users[userIndex],
        side,
        position,
        totalOnSide: seatsOnSide,
      });
      userIndex++;
    }
  });

  return positions;
};

export const Seats = ({ votes, isRevealed, participants, currentUserId }: SeatsProps) => {
  const users = convertToUsers(votes, participants, currentUserId);
  const seatPositions = calculateSeatPositions(users);
  const isMobile = useIsMobile();

  return (
    <SeatsContainer>
      <TableContainer>
        {seatPositions.map((seatPos) => (
          seatPos.user.voted ? (
            <AnimatedCard
              key={`card-${seatPos.user.id}`}
              value={seatPos.user.vote}
              isRevealed={isRevealed}
              isCurrentUser={seatPos.user.isCurrentUser}
              voted={seatPos.user.voted}
              delay={seatPos.user.id * 200} 
              side={seatPos.side}
              position={seatPos.position}
              totalOnSide={seatPos.totalOnSide}
              isMobile={isMobile}
            />
          ) : (
            <CardPlaceholder
              key={`card-${seatPos.user.id}`}
              side={seatPos.side}
              position={seatPos.position}
              totalOnSide={seatPos.totalOnSide}
              voted={seatPos.user.voted}
              isCurrentUser={seatPos.user.isCurrentUser}
              isMobile={isMobile}
            >
              {seatPos.user.voted ? (isRevealed ? seatPos.user.vote : '?') : ''}
            </CardPlaceholder>
          )
        ))}
      </TableContainer>
      {!isMobile ? (
        <>
          {seatPositions.map((seatPos) => (
            <Seat
              key={seatPos.user.id}
              user={seatPos.user}
              side={seatPos.side}
              position={seatPos.position}
              totalOnSide={seatPos.totalOnSide}
            />
          ))}
        </>
      ) : (
        <SeatsMobile users={users} />
      )}
    </SeatsContainer>
  );
}; 