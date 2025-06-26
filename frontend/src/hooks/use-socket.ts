import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Environment-based socket URL configuration
const isDevelopment = import.meta.env.DEV;
const SOCKET_URL = isDevelopment 
  ? 'http://localhost:3001' 
  : ''; // Use relative URLs in production to leverage Netlify proxy

interface VoteData {
  userId: string;
  value: string;
  timestamp: Date;
}

interface Participant {
  userId: string;
  username: string;
}

interface RoomStatus {
  roomId: string;
  name: string;
  participants: Participant[];
  currentRound: number;
  roundStats: {
    roundNumber: number;
    totalVotes: number;
    isRevealed: boolean;
    participants: number;
    voteCount: number;
  };
  canControlRounds: boolean;
  timerStatus?: {
    isRunning: boolean;
    timeRemaining: number;
    totalTime: number;
  };
}

interface RoundHistory {
  roomId: string;
  roundHistory: Array<{
    roundNumber: number;
    votes: VoteData[];
    revealedAt: Date;
    totalVotes: number;
  }>;
  totalRounds: number;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  roomStatus: RoomStatus | null;
  roundHistory: RoundHistory | null;
  currentVotes: VoteData[];
  timerStatus: {
    isRunning: boolean;
    timeRemaining: number;
    totalTime: number;
  } | null;
  joinRoom: (roomId: string, userId: string, username: string) => void;
  leaveRoom: (roomId: string, userId: string) => void;
  castVote: (value: string) => void;
  revealVotes: () => void;
  nextRound: () => void;
  resetRound: () => void;
  startTimer: () => void;
  getRoomStatus: () => void;
  getRoundHistory: () => void;
  getTimerStatus: () => void;
}

export const useSocket = (roomId: string, userId: string, username: string): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomStatus, setRoomStatus] = useState<RoomStatus | null>(null);
  const [roundHistory, setRoundHistory] = useState<RoundHistory | null>(null);
  const [currentVotes, setCurrentVotes] = useState<VoteData[]>([]);
  const [timerStatus, setTimerStatus] = useState<{
    isRunning: boolean;
    timeRemaining: number;
    totalTime: number;
  } | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!roomId || !userId || roomId === "") {
      console.log('Skipping socket setup - missing roomId or userId:', { roomId, userId });
      return;
    }

    console.log('Setting up socket connection for room:', roomId, 'user:', userId, 'username:', username);

    // Create socket connection
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current = socket;

    // Add connection state debugging
    console.log('Socket created, current state:', socket.connected);

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from WebSocket server, reason:', reason);
      leaveRoom(roomId, userId);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('🔴 Connection error:', error);
    });

    // Check if already connected
    if (socket.connected) {
      console.log('Socket was already connected, setting state');
      setIsConnected(true);
    }

    // Room events
    socket.on('roomJoined', (data: RoomStatus & { currentVotes?: VoteData[] }) => {
      console.log('Joined room:', data);
      setRoomStatus(data);
      if (data.timerStatus) {
        setTimerStatus(data.timerStatus);
      }
      // Set current votes if provided
      if (data.currentVotes) {
        setCurrentVotes(data.currentVotes);
      }
    });

    socket.on('userJoined', (data: { userId: string; participants: Participant[]; currentRound: number; roundStats: any; currentVotes?: VoteData[] }) => {
      console.log('User joined:', data);
      setRoomStatus(prev => prev ? { ...prev, participants: data.participants, currentRound: data.currentRound, roundStats: data.roundStats } : null);
      // Update current votes if provided
      if (data.currentVotes) {
        setCurrentVotes(data.currentVotes);
      }
    });

    socket.on('userLeft', (data: { userId: string; participants: Participant[]; currentRound: number; roundStats: any; currentVotes?: VoteData[] }) => {
      console.log('User left:', data);
      setRoomStatus(prev => prev ? { ...prev, participants: data.participants, currentRound: data.currentRound, roundStats: data.roundStats } : null);
      // Update current votes if provided
      if (data.currentVotes) {
        setCurrentVotes(data.currentVotes);
      }
    });

    socket.on('roomLeft', (data: { roomId: string; message: string }) => {
      console.log('Left room:', data);
      // Reset room state when user leaves
      setRoomStatus(null);
      setCurrentVotes([]);
      setRoundHistory(null);
    });

    socket.on('roomDeleted', (data: { roomId: string; message: string }) => {
      console.log('Room deleted:', data);
      // Reset room state when room is deleted
      setRoomStatus(null);
      setCurrentVotes([]);
      setRoundHistory(null);
      // Optionally show a notification to the user
      alert('Room has been deleted because all participants left.');
    });

    // Voting events
    socket.on('voteConfirmed', (data: { userId: string; value: string; currentRound: number }) => {
      console.log('Vote confirmed:', data);
      // Update local vote state
      setCurrentVotes(prev => {
        const existingVoteIndex = prev.findIndex(vote => vote.userId === data.userId);
        if (existingVoteIndex !== -1) {
          const updated = [...prev];
          updated[existingVoteIndex] = { userId: data.userId, value: data.value, timestamp: new Date() };
          return updated;
        } else {
          return [...prev, { userId: data.userId, value: data.value, timestamp: new Date() }];
        }
      });
    });

    socket.on('votesUpdated', (data: { userId: string; hasVoted: boolean; currentRound: number; roundStats: any }) => {
      console.log('Votes updated:', data);
      
      // Update currentVotes to track who has voted (with placeholder value)
      if (data.hasVoted) {
        setCurrentVotes(prev => {
          const existingVoteIndex = prev.findIndex(vote => vote.userId === data.userId);
          if (existingVoteIndex !== -1) {
            // Vote already exists, don't duplicate
            return prev;
          } else {
            // Add placeholder vote to show this user has voted
            return [...prev, { userId: data.userId, value: '?', timestamp: new Date() }];
          }
        });
      }
      
      setRoomStatus(prev => prev ? { ...prev, currentRound: data.currentRound, roundStats: data.roundStats } : null);
    });

    socket.on('votesRevealed', (data: { votes: VoteData[]; participants: Participant[]; currentRound: number; roundStats: any }) => {
      console.log('Votes revealed:', data);
      setCurrentVotes(data.votes);
      setRoomStatus(prev => prev ? { ...prev, participants: data.participants, currentRound: data.currentRound, roundStats: data.roundStats } : null);
    });

    // Round control events
    socket.on('nextRound', (data: { currentRound: number; roundStats: any; participants: Participant[]; timerStatus: any; currentVotes?: VoteData[] }) => {
      console.log('Next round:', data);
      setCurrentVotes(data.currentVotes || []); // Use provided votes or empty array
      setRoomStatus(prev => prev ? { ...prev, currentRound: data.currentRound, roundStats: data.roundStats, participants: data.participants } : null);
      if (data.timerStatus) {
        setTimerStatus(data.timerStatus);
      }
    });

    socket.on('roundReset', (data: { currentRound: number; roundStats: any; participants: Participant[]; timerStatus: any; currentVotes?: VoteData[] }) => {
      console.log('Round reset:', data);
      setCurrentVotes(data.currentVotes || []); // Use provided votes or empty array
      setRoomStatus(prev => prev ? { ...prev, currentRound: data.currentRound, roundStats: data.roundStats, participants: data.participants } : null);
      if (data.timerStatus) {
        setTimerStatus(data.timerStatus);
      }
    });

    // Timer events
    socket.on('timerStarted', (data: { timerStatus: any; participants: Participant[] }) => {
      console.log('Timer started:', data);
      setTimerStatus(data.timerStatus);
      setRoomStatus(prev => prev ? { ...prev, participants: data.participants } : null);
    });

    socket.on('timerStatus', (data: { roomId: string; timerStatus: any }) => {
      console.log('Timer status:', data);
      setTimerStatus(data.timerStatus);
    });

    // Status events
    socket.on('roomStatus', (data: RoomStatus) => {
      console.log('Room status:', data);
      setRoomStatus(data);
      if (data.timerStatus) {
        setTimerStatus(data.timerStatus);
      }
    });

    socket.on('roundHistory', (data: RoundHistory) => {
      console.log('Round history:', data);
      setRoundHistory(data);
    });

    // Error handling
    socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [roomId, userId, username]);

  // Join room function
  const joinRoom = useCallback((roomId: string, userId: string, username: string) => {
    if (socketRef.current) {
      socketRef.current.emit('joinRoom', { roomId, userId, username });
    }
  }, []);

  // Cast vote function
  const castVote = useCallback((value: string) => {
    if (socketRef.current && roomId && userId) {
      socketRef.current.emit('vote', { roomId, userId, value });
    }
  }, [roomId, userId]);

  // Reveal votes function (creator only)
  const revealVotes = useCallback(() => {
    if (socketRef.current && roomId && userId) {
      socketRef.current.emit('revealVotes', { roomId, userId });
    }
  }, [roomId, userId]);

  // Next round function (creator only)
  const nextRound = useCallback(() => {
    if (socketRef.current && roomId && userId) {
      socketRef.current.emit('nextRound', { roomId, userId });
    }
  }, [roomId, userId]);

  // Reset round function (creator only)
  const resetRound = useCallback(() => {
    if (socketRef.current && roomId && userId) {
      socketRef.current.emit('resetRound', { roomId, userId });
    }
  }, [roomId, userId]);

  // Get room status function
  const getRoomStatus = useCallback(() => {
    if (socketRef.current && roomId && userId) {
      socketRef.current.emit('getRoomStatus', { roomId, userId });
    }
  }, [roomId, userId]);

  // Get round history function
  const getRoundHistory = useCallback(() => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('getRoundHistory', { roomId });
    }
  }, [roomId]);

  // Leave room function
  const leaveRoom = useCallback((roomId: string, userId: string) => {
    if (socketRef.current && roomId && userId) {
      socketRef.current.emit('leaveRoom', { roomId, userId });
    }
  }, []);

  // Start timer function
  const startTimer = useCallback(() => {
    if (socketRef.current && roomId && userId) {
      socketRef.current.emit('startTimer', { roomId, userId });
    }
  }, [roomId, userId]);

  // Get timer status function
  const getTimerStatus = useCallback(() => {
    if (socketRef.current && roomId && userId) {
      socketRef.current.emit('getTimerStatus', { roomId, userId });
    }
  }, [roomId, userId]);

  return {
    socket: socketRef.current,
    isConnected,
    roomStatus,
    roundHistory,
    currentVotes,
    timerStatus,
    joinRoom,
    leaveRoom,
    castVote,
    revealVotes,
    nextRound,
    resetRound,
    startTimer,
    getRoomStatus,
    getRoundHistory,
    getTimerStatus,
  };
}; 