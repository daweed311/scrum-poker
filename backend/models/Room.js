const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const roundSchema = new mongoose.Schema({
  roundNumber: {
    type: Number,
    required: true
  },
  votes: [voteSchema],
  isRevealed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  revealedAt: {
    type: Date
  }
});

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: String,
    required: true
  },
  creatorUserId: {
    type: String,
    required: false // Optional for backward compatibility
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  participants: [{
    userId: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  }],
  currentRound: {
    type: Number,
    default: 1
  },
  rounds: [roundSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  // Timer functionality
  timerDuration: {
    type: Number,
    default: 60 // Default 60 seconds
  },
  timerStartTime: {
    type: Date,
    default: null
  },
  timerEndTime: {
    type: Date,
    default: null
  },
  isTimerRunning: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
roomSchema.index({ roomId: 1 });
roomSchema.index({ createdAt: -1 });

// Pre-save middleware to clean up malformed participant data
roomSchema.pre('save', function(next) {
  if (this.participants && Array.isArray(this.participants)) {
    const cleanedParticipants = [];
    
    for (const participant of this.participants) {
      if (typeof participant === 'string') {
        // Convert string to object format
        cleanedParticipants.push({
          userId: participant,
          username: participant
        });
      } else if (participant && typeof participant === 'object' && participant.userId && participant.username) {
        // Valid object format
        cleanedParticipants.push(participant);
      }
      // Skip malformed participants
    }
    
    this.participants = cleanedParticipants;
  }
  next();
});

// Method to add participant
roomSchema.methods.addParticipant = function(userId, username) {
  // Check if user already exists by userId
  const existingParticipant = this.participants.find(p => p.userId === userId);
  if (!existingParticipant) {
    this.participants.push({ userId, username });
  } else {
    // Update username if it changed
    existingParticipant.username = username;
  }
  return this.save();
};

// Method to remove participant
roomSchema.methods.removeParticipant = function(userId) {
  const index = this.participants.findIndex(p => p.userId === userId);
  if (index > -1) {
    this.participants.splice(index, 1);
  }
  
  // If no participants left, delete the room
  if (this.participants.length === 0) {
    console.log(`🗑️ Room ${this.roomId} has no participants left, deleting room`);
    return this.deleteOne().then(() => true); // Return true to indicate room was deleted
  }
  
  return this.save().then(() => false); // Return false to indicate room was not deleted
};

// Method to get current round
roomSchema.methods.getCurrentRound = function() {
  return this.rounds.find(round => round.roundNumber === this.currentRound);
};

// Method to create new round
roomSchema.methods.createNewRound = function() {
  const newRoundNumber = this.currentRound + 1;
  const newRound = {
    roundNumber: newRoundNumber,
    votes: [],
    isRevealed: false,
    createdAt: new Date()
  };
  
  this.rounds.push(newRound);
  this.currentRound = newRoundNumber;
  
  // Stop timer when new round is created
  this.isTimerRunning = false;
  this.timerStartTime = null;
  this.timerEndTime = null;
  
  return this.save();
};

// Method to reset current round
roomSchema.methods.resetCurrentRound = function() {
  const currentRound = this.getCurrentRound();
  if (currentRound) {
    currentRound.votes = [];
    currentRound.isRevealed = false;
    currentRound.revealedAt = null;
  }
  
  // Stop timer when round is reset
  this.isTimerRunning = false;
  this.timerStartTime = null;
  this.timerEndTime = null;
  
  return this.save();
};

// Method to cast vote in current round
roomSchema.methods.castVote = function(userId, voteValue) {
  const currentRound = this.getCurrentRound();
  
  if (!currentRound) {
    throw new Error('No active round found');
  }
  
  if (currentRound.isRevealed) {
    throw new Error('Cannot vote after votes have been revealed');
  }
  
  // Check if user already voted in this round
  const existingVoteIndex = currentRound.votes.findIndex(vote => vote.userId === userId);
  
  if (existingVoteIndex !== -1) {
    // Update existing vote
    currentRound.votes[existingVoteIndex].value = voteValue;
    currentRound.votes[existingVoteIndex].timestamp = new Date();
  } else {
    // Add new vote
    currentRound.votes.push({
      userId,
      value: voteValue,
      timestamp: new Date()
    });
  }
  
  return this.save();
};

// Method to check if all participants have voted in current round
roomSchema.methods.allParticipantsVoted = function() {
  const currentRound = this.getCurrentRound();
  
  if (!currentRound) {
    return false;
  }
  
  if (currentRound.isRevealed) {
    return false;
  }
  
  // Get unique user IDs who have voted
  const votedUserIds = [...new Set(currentRound.votes.map(vote => vote.userId))];
  
  // Check if all participants have voted
  return this.participants.length > 0 && votedUserIds.length === this.participants.length;
};

// Method to reveal votes in current round
roomSchema.methods.revealVotes = function() {
  const currentRound = this.getCurrentRound();
  
  if (!currentRound) {
    throw new Error('No active round found');
  }
  
  currentRound.isRevealed = true;
  currentRound.revealedAt = new Date();
  return this.save();
};

// Method to get votes for current round (only if revealed)
roomSchema.methods.getCurrentRoundVotes = function() {
  const currentRound = this.getCurrentRound();
  
  if (!currentRound) {
    return null;
  }
  
  if (!currentRound.isRevealed) {
    return null;
  }
  
  return currentRound.votes.map(vote => ({
    userId: vote.userId,
    value: vote.value,
    timestamp: vote.timestamp
  }));
};

// Method to check if user can control rounds (is creator)
roomSchema.methods.canControlRounds = function(userId) {
  return this.creatorUserId === userId;
};

// Method to get round statistics
roomSchema.methods.getRoundStats = function() {
  const currentRound = this.getCurrentRound();
  
  if (!currentRound) {
    return {
      roundNumber: this.currentRound,
      totalVotes: 0,
      isRevealed: false,
      participants: this.participants.length
    };
  }
  
  return {
    roundNumber: currentRound.roundNumber,
    totalVotes: currentRound.votes.length,
    isRevealed: currentRound.isRevealed,
    participants: this.participants.length,
    votes: currentRound.votes.map(vote => ({
      userId: vote.userId,
      value: vote.value,
      timestamp: vote.timestamp
    }))
  };
};

// Timer methods
roomSchema.methods.startTimer = function() {
  this.timerStartTime = new Date();
  this.timerEndTime = new Date(this.timerStartTime.getTime() + (this.timerDuration * 1000));
  this.isTimerRunning = true;
  return this.save();
};

roomSchema.methods.stopTimer = function() {
  this.isTimerRunning = false;
  this.timerStartTime = null;
  this.timerEndTime = null;
  return this.save();
};

roomSchema.methods.getTimerStatus = function() {
  if (!this.isTimerRunning || !this.timerEndTime) {
    return {
      isRunning: false,
      timeRemaining: 0,
      totalTime: this.timerDuration
    };
  }

  const now = new Date();
  const timeRemaining = Math.max(0, Math.ceil((this.timerEndTime.getTime() - now.getTime()) / 1000));
  
  return {
    isRunning: this.isTimerRunning,
    timeRemaining,
    totalTime: this.timerDuration
  };
};

roomSchema.methods.isTimerExpired = function() {
  if (!this.isTimerRunning || !this.timerEndTime) {
    return false;
  }
  
  const now = new Date();
  return now >= this.timerEndTime;
};

// Static method to clean up all rooms with malformed participant data
roomSchema.statics.cleanupParticipants = async function() {
  const rooms = await this.find({});
  let cleanedCount = 0;
  
  for (const room of rooms) {
    let needsUpdate = false;
    const cleanedParticipants = [];
    
    for (const participant of room.participants) {
      if (typeof participant === 'string') {
        // Convert string to object format
        cleanedParticipants.push({
          userId: participant,
          username: participant
        });
        needsUpdate = true;
      } else if (participant && typeof participant === 'object' && participant.userId && participant.username) {
        // Valid object format
        cleanedParticipants.push(participant);
      } else {
        // Malformed data - skip it
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      room.participants = cleanedParticipants;
      await room.save();
      cleanedCount++;
      console.log(`Cleaned up room: ${room.roomId}`);
    }
  }
  
  console.log(`Cleaned up ${cleanedCount} rooms`);
  return cleanedCount;
};

module.exports = mongoose.model('Room', roomSchema); 