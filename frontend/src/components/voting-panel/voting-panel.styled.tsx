import styled from "@emotion/styled";

export const VotingPanelContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: var(--bg-card);
  border-top: 1px solid var(--border-primary);
  padding: 1.5rem;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 200;

  @media (max-width: 768px) {
    padding: 1rem;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 4px;
      background: var(--border-secondary);
      border-radius: 2px;
      opacity: 0.6;
    }
  }
`;

export const VotingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
`;

export const VotingTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  margin-bottom: 1.2rem;
  text-align: center;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 10rem;
  width: 50px;
  height: 50px;
  border: none;
  background: var(--bg-secondary);
  border: 1px solid var(--border-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
  font-size: 1.25rem;
  line-height: 1;

  &:hover {
    background: var(--bg-tertiary);
    border-color: var(--border-primary);
    color: var(--text-primary);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    top: 0.75rem;
    right: 0.75rem;
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }
`;

export const VotingCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 0.75rem;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 0.5rem;
    padding: 0.5rem 0;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      display: none;
    }
    
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  @media (max-width: 480px) {
    gap: 0.375rem;
    padding: 0.375rem 0;
  }
`;

export const SelectedVoteDisplay = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  color: var(--text-primary);
  font-weight: 500;

  strong {
    color: var(--accent-color);
    font-weight: 700;
  }

  @media (max-width: 768px) {
    margin-top: 0.75rem;
    padding: 0.5rem;
    font-size: 0.875rem;
  }
`; 