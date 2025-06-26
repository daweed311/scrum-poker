import styled from "@emotion/styled";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-overlay);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

export const ModalContent = styled.div`
  background: var(--modal-bg);
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  overflow-y: auto;
  box-shadow: var(--modal-shadow);
  animation: modalSlideIn 0.3s ease-out;
  max-height: 100%;
  @media (max-width: 768px) {
    border-radius: 16px;
    padding: 1.5rem;
    max-width: calc(100vw - 1rem);
    max-height: calc(100vh - 1rem);
    margin: 0.5rem;
  }

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    padding: 0.3rem;
    font-size: 0.875rem;
  }
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid var(--input-border);
  border-radius: 12px;
  font-family: "Onest", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--input-bg);
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--input-focus-border);
    background: var(--bg-card);
    box-shadow: 0 0 0 3px var(--input-focus-shadow);
  }

  &::placeholder {
    color: var(--text-muted);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 16px;
    border-radius: 10px;
  }
`;

export const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 2px solid var(--input-border);
  border-radius: 12px;
  font-family: "Onest", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--input-bg);
  color: var(--text-primary);
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: var(--input-focus-border);
    background: var(--bg-card);
    box-shadow: 0 0 0 3px var(--input-focus-shadow);
  }

  &::placeholder {
    color: var(--text-muted);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 16px;
    border-radius: 10px;
    min-height: 60px;
  }
`;
export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

export const Label = styled.label`
  font-family: "Onest", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

export const CharacterCount = styled.span`
  font-family: "Onest", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: right;
  margin-top: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    margin-top: 0.2rem;
  }
`;
