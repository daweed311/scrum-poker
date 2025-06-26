import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

interface TimerProps {
  isRunning: boolean;
  timeRemaining: number;
  totalTime: number;
  compact?: boolean;
}

export const Timer = ({ isRunning, timeRemaining, totalTime, compact = false }: TimerProps) => {
  const [displayTime, setDisplayTime] = useState(timeRemaining);

  useEffect(() => {
    setDisplayTime(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (!isRunning) {
      setDisplayTime(0);
      return;
    }

    const interval = setInterval(() => {
      setDisplayTime(prev => {
        const newTime = Math.max(0, prev - 1);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? ((totalTime - displayTime) / totalTime) * 100 : 0;

  if (!isRunning && displayTime === 0) {
    return null;
  }

  if (compact) {
    return (
      <CompactTimerContainer isRunning={isRunning}>
        <CompactTimerDisplay isRunning={isRunning}>
          {formatTime(displayTime)}
        </CompactTimerDisplay>
        <CompactProgressBar>
          <CompactProgressFill progress={progress} isRunning={isRunning} />
        </CompactProgressBar>
      </CompactTimerContainer>
    );
  }

  return (
    <TimerContainer>
      <TimerDisplay isRunning={isRunning}>
        {formatTime(displayTime)}
      </TimerDisplay>
      <ProgressBar>
        <ProgressFill progress={progress} isRunning={isRunning} />
      </ProgressBar>
    </TimerContainer>
  );
};

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TimerDisplay = styled.div<{ isRunning: boolean }>`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.isRunning ? '#f59e0b' : '#22c55e'};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: color 0.3s ease;
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number; isRunning: boolean }>`
  height: 100%;
  width: ${props => props.progress}%;
  background: ${props => props.isRunning ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #22c55e, #16a34a)'};
  transition: width 1s linear, background 0.3s ease;
`;

// Compact timer styles for header
const CompactTimerContainer = styled.div<{ isRunning: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: ${props => props.isRunning ? 'rgba(245, 158, 11, 0.1)' : 'rgba(34, 197, 94, 0.1)'};
  border-radius: 8px;
  border: 1px solid ${props => props.isRunning ? 'rgba(245, 158, 11, 0.3)' : 'rgba(34, 197, 94, 0.3)'};
  min-width: 80px;
  margin: 0 auto;

  @media (max-width: 875px) {
    padding: 0.25rem;
    min-width: 60px;
    margin: 0 auto;
    align-self: center;
  }
`;

const CompactTimerDisplay = styled.div<{ isRunning: boolean }>`
  font-size: 1rem;
  font-weight: bold;
  color: ${props => props.isRunning ? '#f59e0b' : '#22c55e'};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  transition: color 0.3s ease;

  @media (max-width: 875px) {
    font-size: 0.875rem;
  }
`;

const CompactProgressBar = styled.div`
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;

  @media (max-width: 875px) {
    width: 50px;
    height: 3px;
  }
`;

const CompactProgressFill = styled.div<{ progress: number; isRunning: boolean }>`
  height: 100%;
  width: ${props => props.progress}%;
  background: ${props => props.isRunning ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #22c55e, #16a34a)'};
  transition: width 1s linear, background 0.3s ease;
`; 