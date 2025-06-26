import styled from "@emotion/styled";

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    gap: 0.375rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-top: 0.375rem;
  }
`;

export const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--button-secondary-border);
  border-radius: 12px;
  background: var(--button-secondary-bg);
  color: var(--button-secondary-color);
  font-family: "Onest", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--border-accent);
    background: var(--bg-secondary);
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.625rem 1rem;
    border-radius: 10px;
  }
`;

export const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  background: var(--button-primary-bg);
  color: white;
  font-family: "Onest", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.625rem 1rem;
    border-radius: 10px;
  }
`;
