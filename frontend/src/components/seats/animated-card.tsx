import { useState, useEffect } from "react";
import { CardContainer, CardFront, CardBack } from "./index.styled";
import { Text } from "../typography";
interface AnimatedCardProps {
  value: string | number | null;
  isRevealed: boolean;
  isCurrentUser: boolean;
  voted: boolean;
  delay?: number;
  side: "A" | "B" | "C" | "D";
  position: number;
  totalOnSide: number;
  isMobile: boolean;
}

export const AnimatedCard = ({
  value,
  isRevealed,
  isCurrentUser,
  voted,
  delay = 0,
  side,
  position,
  totalOnSide,
  isMobile,
}: AnimatedCardProps) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isRevealed && voted && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, delay);
      return () => clearTimeout(timer);
    } else if (!isRevealed) {
      setHasAnimated(false);
    }
  }, [isRevealed, voted, delay, hasAnimated]);

  const shouldStayFlipped = isRevealed && voted;

  return (
    <CardContainer
      isFlipped={shouldStayFlipped}
      isCurrentUser={isCurrentUser}
      voted={voted}
      side={side}
      position={position}
      totalOnSide={totalOnSide}
      isMobile={isMobile}
    >
      <CardFront
        id="front"
        voted={voted}
        isCurrentUser={isCurrentUser}
        isRevealed={isRevealed}
      >
        {voted ? "?" : ""}
      </CardFront>
      <CardBack id="back" isCurrentUser={isCurrentUser}>
        <Text>{value}</Text>
      </CardBack>
    </CardContainer>
  );
};
