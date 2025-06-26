import { Heading } from "../typography";
import { RoomHeaderContainer, VotingProgress, TimerWrapper, RoomNameWrapper } from "./room-header.styled";
import { Timer } from "../timer";

interface RoomHeaderProps {
  roomName: string;
  votedCount: number;
  totalPlayers: number;
  timerStatus?: {
    isRunning: boolean;
    timeRemaining: number;
    totalTime: number;
  } | null;
}

export const RoomHeader = ({
  roomName,
  votedCount,
  totalPlayers,
  timerStatus,
}: RoomHeaderProps) => {
  return (
    <RoomHeaderContainer>
      <RoomNameWrapper>
        <Heading size="md">{roomName}</Heading>
      </RoomNameWrapper>
      {timerStatus && (
        <TimerWrapper>
          <Timer
            isRunning={timerStatus.isRunning}
            timeRemaining={timerStatus.timeRemaining}
            totalTime={timerStatus.totalTime}
            compact={true}
          />
        </TimerWrapper>
      )}
      <VotingProgress>
        {votedCount}/{totalPlayers} voted
      </VotingProgress>
    </RoomHeaderContainer>
  );
};
