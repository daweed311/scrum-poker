import type { User } from "../types";
import {
  MobileContainer,
  UserItem,
  Avatar,
  UserInfo,
  Username,
  DecisionStatus,
} from "./seats-mobile.styled";
import { Text } from "../../typography";

interface SeatsMobileProps {
  users: User[];
}

export const SeatsMobile = ({ users }: SeatsMobileProps) => {
  const getDecisionStatus = (user: User) => {
    if (user.voted) {
      return user.vote !== null ? 'Voted' : 'Ready';
    }
    return 'Waiting...';
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a.voted && !b.voted) return -1;
    if (!a.voted && b.voted) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <MobileContainer>
      {sortedUsers.map((user) => (
        <UserItem key={user.id} voted={user.voted}>
          <Avatar 
            src={`https://api.dicebear.com/6.x/bottts/svg?seed=${encodeURIComponent(user.name)}`}
            alt={`${user.name}'s avatar`}
          />
          <UserInfo>
            <Username>{user.name}</Username>
            {user.isCurrentUser && <Text size="md">(You)</Text>}
            <DecisionStatus voted={user.voted}>
              {getDecisionStatus(user)}
            </DecisionStatus>
          </UserInfo>
        </UserItem>
      ))}
    </MobileContainer>
  );
};
