import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table } from "../../components/table";
import { VotingPanel } from "../../components/voting-panel";
import { RoomHeader } from "../../components/room-header";
import { useSocket } from "../../hooks/use-socket";
import { Loader } from "../../components/ui/loader";
import { useUser } from "../../context/user";

export const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { username, userId } = useUser();

  const [showCards, setShowCards] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const {
    isConnected,
    roomStatus,
    currentVotes,
    timerStatus,
    joinRoom,
    castVote,
    revealVotes,
    nextRound,
    resetRound,
    startTimer,
    getRoomStatus,
  } = useSocket(roomId || "", userId, username);
  
  // Join room 
  useEffect(() => {
    if (isConnected && roomId && userId && username) {
      joinRoom(roomId, userId, username);
    }
  }, [isConnected, roomId, userId, username, joinRoom]);

  // Get room status 
  useEffect(() => {
    if (isConnected && roomId && userId && username) {
      getRoomStatus();
    }
  }, [isConnected, roomId, userId, username, getRoomStatus]);

  // Show loading if no roomId
  if (!roomId) {
    return (
      <RoomContainer>
        <Loader
          title="Loading Room"
          subtitle="Getting room information..."
          size="large"
        />
      </RoomContainer>
    );
  }

  // Check if current user has voted
  useEffect(() => {
    const userVote = currentVotes.find(vote => vote.userId === userId);
    setHasVoted(!!userVote);
  }, [currentVotes, userId]);

  const handleVote = (value: string) => {
    castVote(value);
    setShowCards(false);
  };

  const handleRevealVotes = () => {
    revealVotes();
  };

  const handleNextRound = () => {
    nextRound();
  };

  const handleResetRoom = () => {
    resetRound();
  };

  const handleStartVote = () => {
    startTimer();
  };

  if (!isConnected || !roomStatus) {
    return (
      <RoomContainer>
        <Loader
          title="Connecting to Room"
          subtitle="Establishing real-time connection..."
          size="large"
        />
      </RoomContainer>
    );
  }

  const votedCount = currentVotes.length;
  const totalPlayers = roomStatus.participants.length;
  const canControlRounds = roomStatus.canControlRounds;
  return (
    <RoomContainer>
      <RoomHeader
        roomName={roomStatus.name}
        votedCount={votedCount}
        totalPlayers={totalPlayers}
        timerStatus={timerStatus}
      />

      <Table
        votes={currentVotes}
        isRevealed={roomStatus.roundStats.isRevealed}
        participants={roomStatus.participants}
        currentUserId={userId}
      />

      <VotingPanel
        isVisible={showCards}
        onClose={() => setShowCards(false)}
        onVote={handleVote}
        hasVoted={hasVoted}
      />

      <ButtonContainer>
        {!hasVoted && timerStatus?.isRunning && (
          <ShowCardsButton onClick={() => setShowCards(true)}>
            Show Cards
          </ShowCardsButton>
        )}

        {!hasVoted && !timerStatus?.isRunning && !canControlRounds && (
          <WaitingMessage>
            ⏳ Waiting for creator to start vote...
          </WaitingMessage>
        )}

        {hasVoted && (
          <VoteStatus>
            ✅ Voted
          </VoteStatus>
        )}

        {canControlRounds && (
          <>
            {!roomStatus.roundStats.isRevealed && !timerStatus?.isRunning && (
              <StartVoteButton onClick={handleStartVote}>
                Start Vote
              </StartVoteButton>
            )}

            {!roomStatus.roundStats.isRevealed && votedCount > 0 && (
              <RevealButton onClick={handleRevealVotes}>
                Reveal Votes
              </RevealButton>
            )}

            <NextRoundButton onClick={handleNextRound}>
              Next Round
            </NextRoundButton>
            <ResetButton onClick={handleResetRoom}>
              Reset Round
            </ResetButton>
          </>
        )}

      </ButtonContainer>

    </RoomContainer>
  );
};

const RoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
`;


const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 875px) {
    width: 100%;
    padding: 0 1rem;
  }
`;

const ShowCardsButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  @media (max-width: 875px) {
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
  }
`;

const VoteStatus = styled.div`
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RevealButton = styled.button`
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
  }
`;

const NextRoundButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }
`;

const ResetButton = styled.button`
  background: linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
  }

  @media (max-width: 875px) {
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
  }
`;

const StartVoteButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }
`;

const WaitingMessage = styled.div`
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
