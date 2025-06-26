import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heading } from "../../typography";
import {
  ModalContent,
  ModalHeader,
  ModalOverlay,
  CloseButton,
  CharacterCount,
} from "../shared.styled";
import { ButtonGroup, CancelButton, FormGroup, SubmitButton } from "./index.styled";
import { useModalScrollLock } from "../../../hooks/use-modal-scroll-lock";
import { Input, Label, ModalForm } from "../shared.styled";
import { useUser } from "../../../context/user";

const USERNAME_LIMIT = 30;

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string | null;
}

export const JoinRoomModal = ({ isOpen, onClose, roomId }: JoinRoomModalProps) => {
  const navigate = useNavigate();
  const { username, setUsername, setUserId } = useUser();

  const [tempUsername, setTempUsername] = useState(username || "");

  // Prevent body scrolling when modal is open
  useModalScrollLock(isOpen);

  const handleCloseModal = () => {
    setTempUsername(username || "");
    onClose();
  };

  const generateUserId = () => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (tempUsername.trim()) {
      const finalUsername = tempUsername.trim();
      const userId = generateUserId();
      
      // Save to context (which will save to localStorage)
      setUsername(finalUsername);
      setUserId(userId);
      
      navigate(`/room/${roomId}`, { 
        state: { 
          username: finalUsername,
          userId: userId 
        } 
      });
      handleCloseModal();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleCloseModal}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Heading size="xl" weight="bold">
            Join Room
          </Heading>
          <CloseButton onClick={handleCloseModal}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              placeholder="Enter your username..."
              maxLength={USERNAME_LIMIT}
              required
            />
            <CharacterCount>
              {tempUsername.length}/{USERNAME_LIMIT}
            </CharacterCount>
          </FormGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={handleCloseModal}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit">
              Join Room
            </SubmitButton>
          </ButtonGroup>
        </ModalForm>
      </ModalContent>
    </ModalOverlay>
  );
};
