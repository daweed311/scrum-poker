import styled from "@emotion/styled";

export const SeatsContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 600px;
`;

export const TableContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 250px;
  background: var(--bg-card);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  box-shadow: var(--shadow-md);

  @media (max-width: 480px) {
    width: 280px;
    height: 180px;
  }

  @media (max-width: 768px) {
    width: 95%;
    height: 200px;
    position: relative;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const StyledSeat = styled.div<{
  side: "A" | "B" | "C" | "D";
  position: number;
  totalOnSide: number;
  isCurrentUser: boolean;
}>`
  position: absolute;
  display: flex;
  align-items: center;  
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: ${(props) => props.isCurrentUser ? "2px solid var(--border-accent)" : "2px solid var(--border-primary)"};
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  min-width: 140px;
  max-width: 160px;
  z-index: 10;

  &:hover {
    border-color: var(--border-accent);
    box-shadow: var(--shadow-md);
  }

  /* Side A - Top */
  ${(props) =>
    props.side === "A" &&
    `
    top: 25px;
    left: ${
      props.totalOnSide === 1
        ? "50%"
        : props.totalOnSide === 2
        ? props.position === 0
          ? "30%"
          : "70%"
        : props.totalOnSide === 3
        ? props.position === 0
          ? "20%"
          : props.position === 1
          ? "50%"
          : "80%"
        : "50%"
    };
    transform: translateX(-50%);
  `}

  /* Side B - Right */
  ${(props) =>
    props.side === "B" &&
    `
    right: 35px;
    top: ${
      props.totalOnSide === 1
        ? "50%"
        : props.totalOnSide === 2
        ? props.position === 0
          ? "30%"
          : "70%"
        : props.totalOnSide === 3
        ? props.position === 0
          ? "20%"
          : props.position === 1
          ? "50%"
          : "80%"
        : "50%"
    };
    transform: translateY(-50%);
  `}

  /* Side C - Bottom */
  ${(props) =>
    props.side === "C" &&
    `
    bottom: 25px;
    left: ${
      props.totalOnSide === 1
        ? "50%"
        : props.totalOnSide === 2
        ? props.position === 0
          ? "30%"
          : "70%"
        : props.totalOnSide === 3
        ? props.position === 0
          ? "20%"
          : props.position === 1
          ? "50%"
          : "80%"
        : "50%"
    };
    transform: translateX(-50%);
  `}

  /* Side D - Left */
  ${(props) =>
    props.side === "D" &&
    `
    left: 35px;
    top: ${
      props.totalOnSide === 1
        ? "50%"
        : props.totalOnSide === 2
        ? props.position === 0
          ? "30%"
          : "70%"
        : props.totalOnSide === 3
        ? props.position === 0
          ? "20%"
          : props.position === 1
          ? "50%"
          : "80%"
        : "50%"
    };
    transform: translateY(-50%);
  `}

  @media (max-width: 875px) {
    min-width: 120px;
    max-width: 140px;
    padding: 0.5rem;
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    min-width: 100px;
    max-width: 120px;
    padding: 0.375rem;
    gap: 0.375rem;
  }
`;

export const CardPlaceholder = styled.div<{
  side: "A" | "B" | "C" | "D";
  position: number;
  totalOnSide: number;
  voted: boolean;
  isCurrentUser: boolean;
  isMobile: boolean;
}>`
  position: absolute;
  width: 40px;
  height: 56px;
  background: ${(props) =>
    props.voted ? "var(--button-primary-bg)" : "var(--bg-card)"};
  border: 2px solid
    ${(props) => {
      if (props.isCurrentUser) {
        return "var(--border-accent)";
      }
      return props.voted ? "rgba(255, 255, 255, 0.3)" : "var(--border-primary)";
    }};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: ${(props) => (props.voted ? "white" : "var(--text-primary)")};
  font-weight: 700;
  box-shadow: ${(props) => {
    if (props.isCurrentUser) {
      return "0 0 0 3px rgba(102, 126, 234, 0.3), 0 4px 15px rgba(102, 126, 234, 0.4)";
    }
    return props.voted ? "0 4px 15px rgba(102, 126, 234, 0.4)" : "var(--shadow-sm)";
  }};
  z-index: 5;
  transition: all 0.3s ease;
  transform: ${(props) => props.isCurrentUser ? "scale(1.1)" : "scale(1)"};
  animation: ${(props) => props.voted ? "votePulse 2s ease-in-out infinite" : "none"};

  @keyframes votePulse {
    0%, 100% {
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    50% {
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }
  }

  /* Side A - Top (inside table) */
  ${(props) =>
    props.side === "A" &&
    `
    top: 15px;
    left: ${
      props.totalOnSide === 1
        ? "50%"
        : props.totalOnSide === 2
        ? props.position === 0
          ? "30%"
          : "70%"
        : props.totalOnSide === 3
        ? props.position === 0
          ? props.isMobile
            ? "30%"
            : "20%"
          : props.position === 1
          ? "50%"
          : props.isMobile
          ? "70%"
          : "80%"
        : "50%"
    };
    transform: translateX(-50%);
  `}

  /* Side B - Right (inside table) */
  ${(props) =>
    props.side === "B" &&
    `
    right: 15px;
    top: ${
      props.totalOnSide === 1
        ? "50%"
        : props.totalOnSide === 2
        ? props.position === 0
          ? "30%"
          : "70%"
        : props.totalOnSide === 3
        ? props.position === 0
          ? "20%"
          : props.position === 1
          ? "50%"
          : "80%"
        : "50%"
    };
    transform: translateY(-50%);
  `}

  /* Side C - Bottom (inside table) */
  ${(props) =>
    props.side === "C" &&
    `
    bottom: 15px;
    left: ${
      props.totalOnSide === 1
        ? "50%"
        : props.totalOnSide === 2
        ? props.position === 0
          ? "30%"
          : "70%"
        : props.totalOnSide === 3
        ? props.position === 0
          ? props.isMobile
            ? "30%"
            : "20%"
          : props.position === 1
          ? "50%"
          : props.isMobile
          ? "70%"
          : "80%"
        : "50%"
    };
    transform: translateX(-50%);
  `}

  /* Side D - Left (inside table) */
  ${(props) =>
    props.side === "D" &&
    `
    left: 15px;
    top: ${
      props.totalOnSide === 1
        ? "50%"
        : props.totalOnSide === 2
        ? props.position === 0
          ? "30%"
          : "70%"
        : props.totalOnSide === 3
        ? props.position === 0
          ? "20%"
          : props.position === 1
          ? "50%"
          : "80%"
        : "50%"
    };
    transform: translateY(-50%);
  `}

  @media (max-width: 875px) {
    width: 35px;
    height: 49px;
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    width: 30px;
    height: 42px;
    font-size: 0.75rem;
  }
`;

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-gradient-start);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;

  @media (max-width: 875px) {
    width: 28px;

    height: 28px;
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    font-size: 0.625rem;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
`;

export const Username = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 0.625rem;
  }
`;

export const VoteStatus = styled.span`
  font-size: 0.75rem;
  color: var(--text-secondary);

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }

  @media (max-width: 480px) {
    font-size: 0.5rem;
  }
`;


export const CardContainer = styled.div<{
  isFlipped: boolean;
  isCurrentUser: boolean;
  voted: boolean;
  side: "A" | "B" | "C" | "D";
  position: number;
  totalOnSide: number;
  isMobile: boolean;
}>`
  position: absolute;
  width: 40px;
  height: 56px;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: all 0.3s ease-in-out;
  z-index: 5;

  /* Side A - Top (inside table) */
  ${(props) =>
    props.side === "A" &&
    `
    top: 15px;
    left: ${props.totalOnSide === 1
      ? "50%"
      : props.totalOnSide === 2
        ? props.position === 0
          ? "30%"
          : "70%"
        : props.totalOnSide === 3
          ? props.position === 0
            ? props.isMobile
              ? "30%"
              : "20%"
            : props.position === 1
              ? "50%"
              : props.isMobile
                ? "70%"
                : "80%"
          : "50%"
    };
    transform: translateX(-50%) ${props.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
    animation: ${props.isFlipped ? 'cardFlipWithScaleA 1.8s ease-in-out' : 'none'};
  `}

  /* Side B - Right (inside table) */
  ${(props) =>
    props.side === "B" &&
    `
    right: 15px;
    top: ${props.totalOnSide === 1
      ? "50%"
      : props.totalOnSide === 2
        ? props.position === 0
          ? "30%"
          : "70%"
        : props.totalOnSide === 3
          ? props.position === 0
            ? "20%"
            : props.position === 1
              ? "50%"
              : "80%"
          : "50%"
    };
    transform: translateY(-50%) ${props.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
    animation: ${props.isFlipped ? 'cardFlipWithScaleB 1.8s ease-in-out' : 'none'};
  `}

  /* Side C - Bottom (inside table) */
  ${(props) =>
    props.side === "C" &&
    `
    bottom: 15px;
    left: ${props.totalOnSide === 1
      ? "50%"
      : props.totalOnSide === 2
        ? props.position === 0
          ? "30%"
          : "70%"
        : props.totalOnSide === 3
          ? props.position === 0
            ? props.isMobile
              ? "30%"
              : "20%"
            : props.position === 1
              ? "50%"
              : props.isMobile
                ? "70%"
                : "80%"
          : "50%"
    };
    transform: translateX(-50%) ${props.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
    animation: ${props.isFlipped ? 'cardFlipWithScaleC 1.8s ease-in-out' : 'none'};
  `}

  /* Side D - Left (inside table) */
  ${(props) =>
    props.side === "D" &&
    `
    left: 15px;
    top: ${props.totalOnSide === 1
      ? "50%"
      : props.totalOnSide === 2
        ? props.position === 0
          ? "30%"
          : "70%"
        : props.totalOnSide === 3
          ? props.position === 0
            ? "20%"
            : props.position === 1
              ? "50%"
              : "80%"
          : "50%"
    };
    transform: translateY(-50%) ${props.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
    animation: ${props.isFlipped ? 'cardFlipWithScaleD 1.8s ease-in-out' : 'none'};
  `}

  @keyframes cardFlipWithScaleA {
    0% {
      transform: translateX(-50%) rotateY(0deg) scale(1);
    }
    25% {
      transform: translateX(-50%) rotateY(45deg) scale(1.2);
    }
    50% {
      transform: translateX(-50%) rotateY(90deg) scale(1.3);
    }
    75% {
      transform: translateX(-50%) rotateY(135deg) scale(1.2);
    }
    80% {
      transform: translateX(-50%) rotateY(180deg) scale(1.3);
    }
    85% {
      transform: translateX(-50%) rotateY(180deg) scale(1.3);
    }
    100% {
      transform: translateX(-50%) rotateY(180deg) scale(1);
    }
  }

  @keyframes cardFlipWithScaleB {
    0% {
      transform: translateY(-50%) rotateY(0deg) scale(1);
    }
    25% {
      transform: translateY(-50%) rotateY(45deg) scale(1.2);
    }
    50% {
      transform: translateY(-50%) rotateY(90deg) scale(1.3);
    }
    75% {
      transform: translateY(-50%) rotateY(135deg) scale(1.2);
    }
    80% {
      transform: translateY(-50%) rotateY(180deg) scale(1.3);
    }
    85% {
      transform: translateY(-50%) rotateY(180deg) scale(1.3);
    }
    100% {
      transform: translateY(-50%) rotateY(180deg) scale(1);
    }
  }

  @keyframes cardFlipWithScaleC {
    0% {
      transform: translateX(-50%) rotateY(0deg) scale(1);
    }
    25% {
      transform: translateX(-50%) rotateY(45deg) scale(1.2);
    }
    50% {
      transform: translateX(-50%) rotateY(90deg) scale(1.3);
    }
    75% {
      transform: translateX(-50%) rotateY(135deg) scale(1.2);
    }
    80% {
      transform: translateX(-50%) rotateY(180deg) scale(1.3);
    }
    85% {
      transform: translateX(-50%) rotateY(180deg) scale(1.3);
    }
    100% {
      transform: translateX(-50%) rotateY(180deg) scale(1);
    }
  }

  @keyframes cardFlipWithScaleD {
    0% {
      transform: translateY(-50%) rotateY(0deg) scale(1);
    }
    25% {
      transform: translateY(-50%) rotateY(45deg) scale(1.2);
    }
    50% {
      transform: translateY(-50%) rotateY(90deg) scale(1.3);
    }
    75% {
      transform: translateY(-50%) rotateY(135deg) scale(1.2);
    }
    80% {
      transform: translateY(-50%) rotateY(180deg) scale(1.3);
    }
    85% {
      transform: translateY(-50%) rotateY(180deg) scale(1.3);
    }
    100% {
      transform: translateY(-50%) rotateY(180deg) scale(1);
    }
  }

  @media (max-width: 875px) {
    width: 35px;
    height: 49px;
  }

  @media (max-width: 480px) {
    width: 30px;
    height: 42px;
  }
`;

export const CardSide = styled.div<{ isCurrentUser: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  z-index: 1000000;
  border-radius: 6px;
  border: 2px solid ${props => {
    if (props.isCurrentUser) {
      return "var(--border-accent)";
    }
    return "var(--border-primary)";
  }};
  box-shadow: ${props => {
    if (props.isCurrentUser) {
      return "0 0 0 3px rgba(102, 126, 234, 0.3), 0 4px 15px rgba(102, 126, 234, 0.4)";
    }
    return "var(--shadow-sm)";
  }};
  transition: all 0.3s ease;

  @media (max-width: 875px) {
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

export const CardFront = styled(CardSide) <{ voted: boolean, isRevealed: boolean }>`
  background: ${props => props.voted ? "var(--button-primary-bg)" : "var(--bg-card)"};
  color: ${props => props.voted ? "white" : "var(--text-primary)"};
  transform: rotateY(0deg);
`;

export const CardBack = styled(CardSide)`
  background: var(--bg-card);
  color: white;
  transform: rotateY(180deg);
  animation: valueReveal 0.3s ease-out 0.8s;

  @keyframes valueReveal {
    0% {
      opacity: 0;
      transform: rotateY(180deg) scale(0.5);
    }
    100% {
      opacity: 1;
      transform: rotateY(180deg) scale(1);
    }
  }
`;

