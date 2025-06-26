import React from "react";
import { CardContainer, CardValue, CardLabel } from "./card.styled";

export interface CardProps {
  value: number | string;
  label?: string;
  isSelected?: boolean;
  isRevealed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const Card = ({
  value,
  label,
  isSelected = false,
  isRevealed = false,
  onClick,
  disabled = false,
}: CardProps) => {
  const getDisplayValue = (val: number | string) => {
    if (val === "?") return "?";
    if (val === "∞") return "∞";
    if (val === "☕") return "☕";
    return val.toString();
  };

  const getCardColor = (val: number | string) => {
    if (val === "?") return "var(--card-question-color)";
    if (val === "∞") return "var(--card-infinity-color)";
    if (val === "☕") return "var(--card-coffee-color)";

    const numVal = Number(val);
    if (numVal <= 3) return "var(--card-low-color)";
    if (numVal <= 8) return "var(--card-medium-color)";
    return "var(--card-high-color)";
  };

  return (
    <CardContainer
      isSelected={isSelected}
      isRevealed={isRevealed}
      onClick={onClick}
      disabled={disabled}
      style={{ "--card-color": getCardColor(value) } as React.CSSProperties}
    >
      <CardValue>{getDisplayValue(value)}</CardValue>
      {label && <CardLabel>{label}</CardLabel>}
    </CardContainer>
  );
};
