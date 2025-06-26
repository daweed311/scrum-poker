import styled from "@emotion/styled";

export const MobileContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  padding: 1rem;
  max-width: 100%;
  padding-bottom: 100px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
`;

export const UserItem = styled.div<{ voted: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border-secondary);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
  opacity: ${props => props.voted ? 1 : 0.7};
  text-align: center;

  &:hover {
    border-color: var(--border-primary);
    box-shadow: var(--shadow-md);
  }
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
`;

export const Username = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

export const DecisionStatus = styled.span<{ voted: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.voted ? 'var(--success-color)' : 'var(--text-secondary)'};
  font-weight: 500;
`;

export const VoteCard = styled.div<{ voted: boolean }>`
  width: 30px;
  height: 42px;
  background: ${props => props.voted 
    ? 'var(--button-primary-bg)'
    : 'var(--bg-tertiary)'};
  border: 2px solid ${props => props.voted 
    ? 'rgba(255, 255, 255, 0.3)'
    : 'var(--border-secondary)'};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: ${props => props.voted ? 'white' : 'var(--text-muted)'};
  font-weight: 700;
  flex-shrink: 0;
`;