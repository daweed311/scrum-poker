import styled from "@emotion/styled";

export const RoomHeaderContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 70px;
  background-color: var(--bg-card);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
  margin-top: 0.4rem;
  border-radius: 10px;
  padding: 0 10px;

  @media (max-width: 875px) {
    width: 95%;
    margin: 0 auto;
    margin-top: 10px;
    height: auto;
    min-height: 70px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 0.5rem;
  }
`;

export const RoomNameWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  @media (max-width: 875px) {
  flex: 1;
    order: 1;
    width: 100%;
    justify-content: center;
    text-align: center;
    
    h2 {
      word-wrap: break-word;
      word-break: break-word;
      hyphens: auto;
      max-width: 100%;
      line-height: 1.2;
    }
  }
`;

export const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

  @media (max-width: 875px) {
    order: 2;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const VotingProgress = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border-secondary);

  @media (max-width: 875px) {
    order: 3;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
`;
