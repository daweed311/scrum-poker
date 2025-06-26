import { useState } from "react";
import { CreateRoomModal } from "../../components/modals/create-room";
import {
  Container,
  ContentWrapper,
  Header,
  CardsGrid,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardStats,
  CardAction,
  HeaderActions,
  StateContainer,
  LoadingSpinner,
  LoadingText,
  LoadingSubtext,
  ErrorIcon,
  ErrorTitle,
  ErrorMessage,
  RetryButton,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateMessage,
} from "./lobby.styled";
import { Users, Clock, ArrowRight } from "lucide-react";
import { Heading, Text } from "../../components/typography";
import { JoinRoomModal } from "../../components/modals/join-room";
import { useRooms } from "../../hooks/use-api";

export const Lobby = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const { data: rooms, loading, error } = useRooms(10000); // Refresh every 10 seconds

  const handleCloseJoinModal = () => {
    setIsJoinModalOpen(false);
    setSelectedRoomId(null);
  };

  const handleJoinRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsJoinModalOpen(true);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading && !rooms) {
    return (
      <Container>
        <ContentWrapper>
          <StateContainer>
            <LoadingSpinner />
            <LoadingText>Loading Rooms</LoadingText>
            <LoadingSubtext>Fetching available planning sessions...</LoadingSubtext>
          </StateContainer>
        </ContentWrapper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ContentWrapper>
          <StateContainer>
            <ErrorIcon />
            <ErrorTitle>Oops! Something went wrong</ErrorTitle>
            <ErrorMessage>
              We couldn't load the rooms. This might be due to a network issue or the server being temporarily unavailable.
            </ErrorMessage>
            <RetryButton onClick={handleRetry}>
              Try Again
            </RetryButton>
          </StateContainer>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <ContentWrapper>
          <Header>
            <Heading size="3xl" weight="extrabold" align="center" gradient>
              Game Lobby
            </Heading>
            <Text size="lg" color="secondary" align="center">
              Join an existing room or create a new one to start your planning
              session
            </Text>
            <HeaderActions>
              <CreateRoomModal />
            </HeaderActions>
          </Header>

          <CardsGrid>
            {rooms && rooms.length > 0 ? (
              rooms.map((room) => (
                <Card key={room.roomId}>
                  <CardHeader>
                    <Heading size="lg" weight="bold">
                      {room.name}
                    </Heading>
                  </CardHeader>

                  <CardContent>
                    <Text color="secondary" lineHeight="relaxed">
                      Created by {room.createdBy}
                    </Text>
                  </CardContent>

                  <CardFooter>
                    <CardStats>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Users size={16} />
                        {room.participantCount}
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Clock size={16} />
                        Round {room.currentRound}
                      </span>
                    </CardStats>

                    <CardAction onClick={() => handleJoinRoom(room.roomId)}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        Join
                        <ArrowRight size={16} />
                      </span>
                    </CardAction>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <StateContainer>
                <EmptyStateIcon />
                <EmptyStateTitle>No Rooms Available</EmptyStateTitle>
                <EmptyStateMessage>
                  There are no active planning sessions at the moment. Be the first to create a room and start planning!
                </EmptyStateMessage>
              </StateContainer>
            )}
          </CardsGrid>
        </ContentWrapper>
      </Container>
      <JoinRoomModal
        isOpen={isJoinModalOpen}
        onClose={handleCloseJoinModal}
        roomId={selectedRoomId}
      />
    </>
  );
};
