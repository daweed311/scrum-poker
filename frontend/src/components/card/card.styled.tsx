import styled from "@emotion/styled";

export const CardContainer = styled.div<{
  isSelected?: boolean;
  isRevealed?: boolean;
  disabled?: boolean;
}>`
  position: relative;
  width: 60px;
  height: 84px;
  background: ${(props) =>
    props.isRevealed
      ? "linear-gradient(135deg, var(--card-color), var(--card-color))"
      : "linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)"};
  border-radius: 8px;
  border: 2px solid
    ${(props) => {
      if (props.isSelected) return "var(--border-accent)";
      if (props.isRevealed) return "var(--border-primary)";
      return "var(--border-secondary)";
    }};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) => {
    if (props.isSelected) return "var(--shadow-lg)";
    if (props.isRevealed) return "var(--shadow-md)";
    return "var(--shadow-sm)";
  }};
  transform: ${(props) =>
    props.isSelected
      ? "translateY(-8px) scale(1.05)"
      : "translateY(0) scale(1)"};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover {
    transform: ${(props) => {
      if (props.disabled) return "translateY(0) scale(1)";
      if (props.isSelected) return "translateY(-12px) scale(1.08)";
      return "translateY(-4px) scale(1.02)";
    }};
    box-shadow: ${(props) => {
      if (props.disabled) return "var(--shadow-sm)";
      if (props.isSelected) return "var(--shadow-xl)";
      return "var(--shadow-lg)";
    }};
  }

  &:active {
    transform: ${(props) =>
      props.disabled
        ? "translateY(0) scale(1)"
        : "translateY(-2px) scale(1.01)"};
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 70px;
    border-radius: 6px;
    flex-shrink: 0;
    scroll-snap-align: center;
  }

  @media (max-width: 480px) {
    width: 45px;
    height: 63px;
    border-radius: 5px;
  }
`;

export const CardValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  line-height: 1;
  margin-bottom: 0.25rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;

export const CardLabel = styled.div`
  font-size: 0.5rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 0.375rem;
  }

  @media (max-width: 480px) {
    font-size: 0.25rem;
  }
`;
