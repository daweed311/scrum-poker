import { Plus, X } from "lucide-react";
import { Heading } from "../../typography";
import {
  FormGroup,
  HelperText,
  ButtonGroup,
  CancelButton,
  SubmitButton,
} from "./index.styled";
import { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  CloseButton,
  Input,
  TextArea,
  CharacterCount,
} from "../shared.styled";
import { useModalScrollLock } from "../../../hooks/use-modal-scroll-lock";
import { Label, ModalForm } from "../shared.styled";
import { useCreateRoom } from "../../../hooks/use-api";
import { CreateRoomButton } from "../../../pages/lobby/lobby.styled";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/user";

const NAME_LIMIT = 50;
const DESCRIPTION_LIMIT = 100;

export const CreateRoomModal = ({ }) => {
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [questionTimer, setQuestionTimer] = useState("60");
  const [roundCount, setRoundCount] = useState("5");
  const [tempCreatedBy, setTempCreatedBy] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { createRoom, loading, error, data } = useCreateRoom();
  const { username, setUsername, setUserId } = useUser();

  useModalScrollLock(showModal);

  // Initialize tempCreatedBy with saved username
  useEffect(() => {
    if (username) {
      setTempCreatedBy(username);
    }
  }, [username]);

  const generateUserId = () => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  useEffect(() => {
    if (data && data.success && data.data?.roomId) {
      setShowModal(false);
      handleCloseModal();

      navigate(`/room/${data.data.roomId}`);
    }
  }, [data, navigate, tempCreatedBy, setUsername, setUserId, generateUserId, username]);

  const handleCloseModal = () => {
    setRoomName("");
    setRoomDescription("");
    setQuestionTimer("60");
    setRoundCount("5");
    setTempCreatedBy(username || "");
    setShowModal(false);
  };

  const handleCreateRoom = () => {
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = generateUserId();
    setUsername(tempCreatedBy.trim());
    setUserId(userId);

    const roomData = {
      name: roomName,
      description: roomDescription,
      questionTimer: Number(questionTimer),
      roundCount: Number(roundCount),
      createdBy: tempCreatedBy,
      userId: userId,
    };

    createRoom(roomData);
  };

  if (!showModal)
    return (
      <CreateRoomButton onClick={handleCreateRoom}>
        <Plus size={20} />
        <span>Create Room</span>
      </CreateRoomButton>
    );

  return (
    <>
      <ModalOverlay onClick={handleCloseModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <Heading size="md" weight="bold">
              Create New Room
            </Heading>
            <CloseButton onClick={handleCloseModal}>
              <X size={24} />
            </CloseButton>
          </ModalHeader>

          <ModalForm onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  color: "var(--color-error)",
                  marginBottom: "1rem",
                  padding: "0.5rem",
                  backgroundColor: "var(--bg-error)",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                }}
              >
                Error: {error}
              </div>
            )}

            <FormGroup>
              <Label htmlFor="createdBy">Your Name</Label>
              <Input
                id="createdBy"
                type="text"
                value={tempCreatedBy}
                onChange={(e) => setTempCreatedBy(e.target.value)}
                placeholder="Enter your name..."
                maxLength={NAME_LIMIT}
                required
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="roomName">Room Name</Label>
              <Input
                id="roomName"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name..."
                maxLength={NAME_LIMIT}
                required
                disabled={loading}
              />
              <CharacterCount>
                {roomName.length}/{NAME_LIMIT}
              </CharacterCount>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="roomDescription">Room Description</Label>
              <TextArea
                id="roomDescription"
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
                placeholder="Describe what this room is for..."
                maxLength={DESCRIPTION_LIMIT}
                rows={3}
                disabled={loading}
              />
              <CharacterCount>
                {roomDescription.length}/{DESCRIPTION_LIMIT}
              </CharacterCount>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="questionTimer">Question Timer (seconds)</Label>
              <Input
                id="questionTimer"
                type="text"
                value={questionTimer}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    setQuestionTimer(value);
                  }
                }}
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="60"
                required
                disabled={loading}
              />
              <HelperText>
                Time allocated for each topic to vote (30-300 seconds)
              </HelperText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="roundCount">Round Count</Label>
              <Input
                id="roundCount"
                type="text"
                value={roundCount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    setRoundCount(value);
                  }
                }}
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="5"
                required
                disabled={loading}
              />
              <HelperText>
                Number of rounds for the planning session (1-15)
              </HelperText>
            </FormGroup>

            <ButtonGroup>
              <CancelButton
                type="button"
                onClick={handleCloseModal}
                disabled={loading}
              >
                Cancel
              </CancelButton>
              <SubmitButton type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Room"}
              </SubmitButton>
            </ButtonGroup>
          </ModalForm>
        </ModalContent>
      </ModalOverlay>
    </>
  );
};
