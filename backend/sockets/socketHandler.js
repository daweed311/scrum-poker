const Room = require('../models/Room');

const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join room
    socket.on('joinRoom', async (data) => {
      try {
        const { roomId, userId, username } = data;

        if (!roomId || !userId) {
          socket.emit('error', { message: 'Room ID and User ID are required' });
          return;
        }

        // Find room
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Add user to participants if not already present
        await room.addParticipant(userId, username || userId);

        // Get fresh room data after adding participant
        const updatedRoom = await Room.findOne({ roomId });

        // Join socket room
        socket.join(roomId);
        socket.roomId = roomId;
        socket.userId = userId;
        socket.username = username || userId; // Store username for display

        // Notify other users in the room
        socket.to(roomId).emit('userJoined', {
          userId,
          username: socket.username,
          participants: updatedRoom.participants,
          currentRound: updatedRoom.currentRound,
          roundStats: updatedRoom.getRoundStats(),
          currentVotes: updatedRoom.getCurrentRound()?.votes || []
        });

        // Send confirmation to joining user
        socket.emit('roomJoined', {
          roomId,
          name: updatedRoom.name,
          participants: updatedRoom.participants,
          currentRound: updatedRoom.currentRound,
          roundStats: updatedRoom.getRoundStats(),
          canControlRounds: updatedRoom.canControlRounds(userId),
          timerStatus: updatedRoom.getTimerStatus(),
          currentVotes: updatedRoom.getCurrentRound()?.votes || []
        });

        console.log(`User ${userId} (${socket.username}) joined room ${roomId}`);

      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Leave room
    socket.on('leaveRoom', async (data) => {
      try {
        const { roomId, userId } = data;

        if (!roomId || !userId) {
          socket.emit('error', { message: 'Room ID and User ID are required' });
          return;
        }

        // Find room
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if this is the last participant
        const isLastParticipant = room.participants.length === 1 && room.participants.find(p => p.userId === socket.userId);

        // Remove user from participants (this will delete the room if it's the last participant)
        const roomWasDeleted = await room.removeParticipant(socket.userId);

        // Leave socket room
        socket.leave(roomId);
        
        // Clear room data from socket
        socket.roomId = null;
        socket.userId = null;
        socket.username = null;

        if (roomWasDeleted) {
          // Room was deleted, notify all users in the socket room
          io.to(roomId).emit('roomDeleted', {
            roomId,
            message: 'Room has been deleted because all participants left'
          });
          
          // Force all users to leave the socket room
          io.in(roomId).socketsLeave(roomId);
          
          console.log(`🗑️ Room ${roomId} deleted - all participants left`);
        } else {
          // Get fresh room data after participant removal
          const updatedRoom = await Room.findOne({ roomId });
          if (updatedRoom) {
            // Notify other users in the room that someone left
            socket.to(roomId).emit('userLeft', {
              userId,
              participants: updatedRoom.participants,
              currentRound: updatedRoom.currentRound,
              roundStats: updatedRoom.getRoundStats(),
              currentVotes: updatedRoom.getCurrentRound()?.votes || []
            });
          }
        }

        // Send confirmation to leaving user
        socket.emit('roomLeft', {
          roomId,
          message: roomWasDeleted ? 'Room deleted - you were the last participant' : 'Successfully left the room'
        });

        console.log(`User ${userId} (${socket.username || 'unknown'}) left room ${roomId}`);

      } catch (error) {
        console.error('Error leaving room:', error);
        socket.emit('error', { message: 'Failed to leave room' });
      }
    });

    // Cast vote in current round
    socket.on('vote', async (data) => {
      try {
        const { roomId, userId, value } = data;

        if (!roomId || !userId || value === undefined) {
          socket.emit('error', { message: 'Room ID, User ID, and vote value are required' });
          return;
        }

        // Find room
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Cast vote in current round
        await room.castVote(userId, value);

        // Get fresh room data after casting vote
        const updatedRoom = await Room.findOne({ roomId });

        // Notify other users that someone voted (but don't reveal the vote)
        socket.to(roomId).emit('votesUpdated', {
          userId,
          hasVoted: true,
          currentRound: updatedRoom.currentRound,
          roundStats: updatedRoom.getRoundStats()
        });

        // Confirm vote to the user
        socket.emit('voteConfirmed', {
          userId,
          value,
          currentRound: updatedRoom.currentRound
        });

        console.log(`User ${userId} voted ${value} in round ${updatedRoom.currentRound} of room ${roomId}`);

      } catch (error) {
        console.error('Error casting vote:', error);
        socket.emit('error', { message: error.message || 'Failed to cast vote' });
      }
    });

    // Reveal votes in current round
    socket.on('revealVotes', async (data) => {
      try {
        const { roomId, userId } = data;

        if (!roomId || !userId) {
          socket.emit('error', { message: 'Room ID and User ID are required' });
          return;
        }

        // Find room
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if user is the creator
        if (!room.canControlRounds(userId)) {
          socket.emit('error', { message: 'Only the room creator can reveal votes' });
          return;
        }

        // Reveal votes in current round
        await room.revealVotes();

        // Get fresh room data after revealing votes
        const updatedRoom = await Room.findOne({ roomId });

        // Get votes for current round
        const votes = updatedRoom.getCurrentRoundVotes();

        // Emit revealed votes to all users in the room
        io.to(roomId).emit('votesRevealed', {
          votes,
          participants: updatedRoom.participants,
          currentRound: updatedRoom.currentRound,
          roundStats: updatedRoom.getRoundStats()
        });

        console.log(`Votes revealed in round ${updatedRoom.currentRound} of room ${roomId}`);

      } catch (error) {
        console.error('Error revealing votes:', error);
        socket.emit('error', { message: 'Failed to reveal votes' });
      }
    });

    // Next round (creator only)
    socket.on('nextRound', async (data) => {
      try {
        const { roomId, userId } = data;

        if (!roomId || !userId) {
          socket.emit('error', { message: 'Room ID and User ID are required' });
          return;
        }

        // Find room
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if user is the creator
        if (!room.canControlRounds(userId)) {
          socket.emit('error', { message: 'Only the room creator can control rounds' });
          return;
        }

        // Create new round
        await room.createNewRound();

        // Get fresh room data after creating new round
        const updatedRoom = await Room.findOne({ roomId });

        // Notify all users in the room
        io.to(roomId).emit('nextRound', {
          currentRound: updatedRoom.currentRound,
          roundStats: updatedRoom.getRoundStats(),
          participants: updatedRoom.participants,
          timerStatus: updatedRoom.getTimerStatus(),
          currentVotes: updatedRoom.getCurrentRound()?.votes || []
        });

        console.log(`Next round (${updatedRoom.currentRound}) started in room ${roomId}`);

      } catch (error) {
        console.error('Error creating next round:', error);
        socket.emit('error', { message: 'Failed to create next round' });
      }
    });

    // Reset current round (creator only)
    socket.on('resetRound', async (data) => {
      try {
        const { roomId, userId } = data;

        if (!roomId || !userId) {
          socket.emit('error', { message: 'Room ID and User ID are required' });
          return;
        }

        // Find room
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if user is the creator
        if (!room.canControlRounds(userId)) {
          socket.emit('error', { message: 'Only the room creator can control rounds' });
          return;
        }

        // Reset current round
        await room.resetCurrentRound();

        // Get fresh room data after resetting round
        const updatedRoom = await Room.findOne({ roomId });

        // Notify all users in the room
        io.to(roomId).emit('roundReset', {
          currentRound: updatedRoom.currentRound,
          roundStats: updatedRoom.getRoundStats(),
          participants: updatedRoom.participants,
          timerStatus: updatedRoom.getTimerStatus(),
          currentVotes: updatedRoom.getCurrentRound()?.votes || []
        });

        console.log(`Round ${updatedRoom.currentRound} reset in room ${roomId}`);

      } catch (error) {
        console.error('Error resetting round:', error);
        socket.emit('error', { message: 'Failed to reset round' });
      }
    });

    // Start timer (creator only)
    socket.on('startTimer', async (data) => {
      try {
        const { roomId, userId } = data;

        if (!roomId || !userId) {
          socket.emit('error', { message: 'Room ID and User ID are required' });
          return;
        }

        // Find room
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if user is the creator
        if (!room.canControlRounds(userId)) {
          socket.emit('error', { message: 'Only the room creator can start the timer' });
          return;
        }

        // Start timer
        await room.startTimer();

        // Get fresh room data after starting timer
        const updatedRoom = await Room.findOne({ roomId });

        // Notify all users in the room
        io.to(roomId).emit('timerStarted', {
          timerStatus: updatedRoom.getTimerStatus(),
          participants: updatedRoom.participants
        });

        console.log(`Timer started in room ${roomId}`);

      } catch (error) {
        console.error('Error starting timer:', error);
        socket.emit('error', { message: 'Failed to start timer' });
      }
    });

    // Get timer status
    socket.on('getTimerStatus', async (data) => {
      try {
        const { roomId } = data;

        if (!roomId) {
          socket.emit('error', { message: 'Room ID is required' });
          return;
        }

        // Find room
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Send timer status
        socket.emit('timerStatus', {
          roomId: room.roomId,
          timerStatus: room.getTimerStatus()
        });

      } catch (error) {
        console.error('Error getting timer status:', error);
        socket.emit('error', { message: 'Failed to get timer status' });
      }
    });

    // Get room status
    socket.on('getRoomStatus', async (data) => {
      try {
        const { roomId, userId } = data;

        if (!roomId) {
          socket.emit('error', { message: 'Room ID is required' });
          return;
        }

        // Find room
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Send room status
        socket.emit('roomStatus', {
          roomId: room.roomId,
          name: room.name,
          participants: room.participants,
          currentRound: room.currentRound,
          roundStats: room.getRoundStats(),
          canControlRounds: userId ? room.canControlRounds(userId) : false,
          timerStatus: room.getTimerStatus()
        });

      } catch (error) {
        console.error('Error getting room status:', error);
        socket.emit('error', { message: 'Failed to get room status' });
      }
    });

    // Get round history
    socket.on('getRoundHistory', async (data) => {
      try {
        const { roomId } = data;

        if (!roomId) {
          socket.emit('error', { message: 'Room ID is required' });
          return;
        }

        // Find room
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Get round history (only revealed rounds)
        const roundHistory = room.rounds
          .filter(round => round.isRevealed)
          .map(round => ({
            roundNumber: round.roundNumber,
            votes: round.votes.map(vote => ({
              userId: vote.userId,
              value: vote.value,
              timestamp: vote.timestamp
            })),
            revealedAt: round.revealedAt,
            totalVotes: round.votes.length
          }));

        socket.emit('roundHistory', {
          roomId: room.roomId,
          roundHistory,
          totalRounds: room.rounds.length
        });

      } catch (error) {
        console.error('Error getting round history:', error);
        socket.emit('error', { message: 'Failed to get round history' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);
      
      // Remove user from room participants if they were in a room
      if (socket.roomId && socket.userId) {
        try {
          const room = await Room.findOne({ roomId: socket.roomId });
          if (room) {
            // Check if this is the last participant
            const isLastParticipant = room.participants.length === 1 && room.participants.find(p => p.userId === socket.userId);
            
            // Remove user from participants (this will delete the room if it's the last participant)
            const roomWasDeleted = await room.removeParticipant(socket.userId);
            
            if (roomWasDeleted) {
              // Room was deleted, notify all users in the socket room
              io.to(socket.roomId).emit('roomDeleted', {
                roomId: socket.roomId,
                message: 'Room has been deleted because all participants left'
              });
              
              // Force all users to leave the socket room
              io.in(socket.roomId).socketsLeave(socket.roomId);
              
              console.log(`🗑️ Room ${socket.roomId} deleted - all participants disconnected`);
            } else {
              // Get fresh room data after participant removal
              const updatedRoom = await Room.findOne({ roomId: socket.roomId });
              if (updatedRoom) {
                // Notify other users in the room that someone left
                socket.to(socket.roomId).emit('userLeft', {
                  userId: socket.userId,
                  participants: updatedRoom.participants,
                  currentRound: updatedRoom.currentRound,
                  roundStats: updatedRoom.getRoundStats(),
                  currentVotes: updatedRoom.getCurrentRound()?.votes || []
                });
              }
            }
            
            console.log(`User ${socket.userId} (${socket.username || 'unknown'}) disconnected from room ${socket.roomId}`);
          }
        } catch (error) {
          console.error('Error removing user from room on disconnect:', error);
        }
      }
    });
  });
};

module.exports = setupSocketHandlers; 