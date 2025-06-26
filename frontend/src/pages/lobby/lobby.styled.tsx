import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: var(--bg-primary);

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, sans-serif;
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
  }

  p {
    font-family: "Onest", system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, sans-serif;
    font-size: 1.1rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
    }
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  width: 100%;

  /* Mobile: 1 column */
  grid-template-columns: 1fr;

  /* Tablet: 2 columns */
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  /* Desktop: 3 columns (max) */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
  }
`;

export const Card = styled.div`
  background: var(--bg-card);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-primary);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;

  h3 {
    font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 1.1rem;
    }
  }
`;

export const CardContent = styled.div`
  font-family: "Onest", system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  color: var(--text-secondary);
  line-height: 1.6;

  p {
    margin: 0 0 0.75rem 0;
  }
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-secondary);
`;

export const CardStats = styled.div`
  display: flex;
  gap: 1rem;
  font-family: "Onest", system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-size: 0.875rem;
  color: var(--text-muted);
`;

export const CardAction = styled.button`
  background: var(--button-primary-bg);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  font-family: "Onest", system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
`;

export const CreateRoomButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--button-accent-bg);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  font-family: "Onest", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: rotate(90deg);
  }
`;

// Loading and Error States
export const StateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 3rem 2rem;
  background: var(--bg-card);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-primary);
  backdrop-filter: blur(10px);
  margin: 2rem 0;
`;

export const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid var(--border-secondary);
  border-top: 4px solid var(--primary-gradient-start);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const LoadingDots = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary-gradient-start);
    animation: bounce 1.4s ease-in-out infinite both;

    &:nth-of-type(1) { animation-delay: -0.32s; }
    &:nth-of-type(2) { animation-delay: -0.16s; }
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export const LoadingText = styled.h3`
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const LoadingSubtext = styled.p`
  font-family: "Onest", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
  max-width: 300px;
`;

export const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
  animation: pulse 2s infinite;

  &::before {
    content: "⚠️";
    font-size: 2rem;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 12px 35px rgba(255, 107, 107, 0.4);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
    }
  }
`;

export const ErrorTitle = styled.h3`
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ff6b6b;
  margin: 0 0 0.5rem 0;
`;

export const ErrorMessage = styled.p`
  font-family: "Onest", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 1.5rem 0;
  max-width: 400px;
  line-height: 1.5;
`;

export const RetryButton = styled.button`
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-family: "Onest", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const EmptyStateIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);

  &::before {
    content: "🏠";
    font-size: 2rem;
  }
`;

export const EmptyStateTitle = styled.h3`
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
`;

export const EmptyStateMessage = styled.p`
  font-family: "Onest", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
  max-width: 400px;
  line-height: 1.5;
`;

