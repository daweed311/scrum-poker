import {
  Avatar,
  StyledSeat,
  UserInfo,
  Username,
  VoteStatus,
} from "./index.styled";

import { Text } from "../typography";

interface SeatProps {
  user: {
    id: number;
    name: string;
    voted: boolean;
    vote: number | string | null;
    isCurrentUser: boolean;
  };
  side: "A" | "B" | "C" | "D";
  position: number;
  totalOnSide: number;
}

export const Seat = ({ user, side, position, totalOnSide }: SeatProps) => {
  const getVoteStatus = () => {
    if (user.voted) {
      return user.vote !== null ? "Voted" : "Ready";
    }
    return "Waiting...";
  };

  const avatarUrl = `https://api.dicebear.com/6.x/bottts/svg?seed=${encodeURIComponent(
    user.name
  )}`;

  return (
    <StyledSeat side={side} position={position} totalOnSide={totalOnSide} isCurrentUser={user.isCurrentUser}>
      <Avatar>
        <img src={avatarUrl} alt={`${user.name}'s avatar`} />
      </Avatar>
      <UserInfo>
        <Username>{user.name}</Username>
        {user.isCurrentUser && <Text size="xs">(You)</Text>}
        <VoteStatus>{getVoteStatus()}</VoteStatus>
      </UserInfo>
    </StyledSeat>
  );
};
