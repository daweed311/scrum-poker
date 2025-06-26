import { useState } from "react";
import { Card } from "../card";
import {
  VotingPanelContainer,
  VotingTitle,
  VotingCardsGrid,
  SelectedVoteDisplay,
  CloseButton,
} from "./voting-panel.styled";
import { X } from "lucide-react";

interface VotingPanelProps {
  onVote?: (vote: string) => void;
  onClose?: () => void;
  isVisible?: boolean;
  disabled?: boolean;
  hasVoted?: boolean;
}

const VOTING_CARDS = [
  { value: 0, label: "0" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 5, label: "5" },
  { value: 8, label: "8" },
  { value: 13, label: "13" },
  { value: "?", label: "?" },
  { value: "☕", label: "Coffee" },
];

export const VotingPanel = ({
  onVote,
  onClose,
  isVisible = true,
  disabled = false,
  hasVoted = false,
}: VotingPanelProps) => {
  const [selectedVote, setSelectedVote] = useState<string | null>(null);

  const handleCardClick = (vote: number | string) => {
    if (disabled || hasVoted) return;

    const voteString = vote.toString();
    setSelectedVote(voteString);
    onVote?.(voteString);
  };

  const handleClose = () => {
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <VotingPanelContainer>
      <CloseButton onClick={handleClose} aria-label="Close voting panel">
        <X />
      </CloseButton>

      <VotingTitle>
        {hasVoted ? "You have already voted" : "Select your vote"}
      </VotingTitle>

      <VotingCardsGrid>
        {VOTING_CARDS.map((card) => (
          <Card
            key={card.value}
            value={card.value}
            label={card.label}
            isSelected={selectedVote === card.value.toString()}
            onClick={() => handleCardClick(card.value)}
            disabled={disabled || hasVoted}
          />
        ))}
      </VotingCardsGrid>

      {selectedVote !== null && (
        <SelectedVoteDisplay>
          Your vote: <strong>{selectedVote}</strong>
        </SelectedVoteDisplay>
      )}

      {hasVoted && (
        <SelectedVoteDisplay>
          You have already voted in this round
        </SelectedVoteDisplay>
      )}
    </VotingPanelContainer>
  );
};
