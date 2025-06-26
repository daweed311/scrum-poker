const Room = require("../models/Room");
const { v4: uuidv4 } = require("uuid");

// Create a new room
const createRoom = async (req, res) => {
  try {
    const { name, createdBy, roundCount, description, questionTimer, userId } = req.body;

    if (!name || !createdBy || !userId) {
      return res.status(400).json({
        success: false,
        message: "Room name, creator name, and user ID are required",
      });
    }

    // Generate unique room ID
    const roomId = uuidv4().substring(0, 8).toUpperCase();

    const rounds = [];
    for (let i = 0; i < roundCount; i++) {
      rounds.push({
        roundNumber: i + 1,
        votes: [],
        isRevealed: false,
      });
    }

    const room = new Room({
      roomId,
      name,
      createdBy,
      creatorUserId: userId,
      participants: [], // Don't add creator here - they'll be added when they join via socket
      currentRound: 1,
      rounds: rounds,
      timerDuration: questionTimer || 60, // Save timer duration
      description,
    });

    await room.save();

    res.status(201).json({
      success: true,
      data: {
        roomId: room.roomId,
        name: room.name,
        createdBy: room.createdBy,
        createdAt: room.createdAt,
        participants: room.participants,
        currentRound: room.currentRound,
        roundStats: room.getRoundStats(),
      },
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Join an existing room
const joinRoom = async (req, res) => {
  console.log('ASDASD')
  try {
    const { roomId } = req.params;
    const { userId, username } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find room by roomId
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Add user to participants if not already present
    await room.addParticipant(userId);

    res.json({
      success: true,
      data: {
        roomId: room.roomId,
        name: room.name,
        createdBy: room.createdBy,
        participants: room.participants,
        currentRound: room.currentRound,
        roundStats: room.getRoundStats(),
        canControlRounds: room.canControlRounds(userId),
      },
    });
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Leave room
const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find room by roomId
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check if this is the last participant
    const isLastParticipant = room.participants.length === 1 && room.participants.includes(userId);

    // Remove user from participants (this will delete the room if it's the last participant)
    await room.removeParticipant(userId);

    if (isLastParticipant) {
      // Room was deleted
      res.json({
        success: true,
        data: {
          roomId: room.roomId,
          message: "Room deleted - you were the last participant",
          deleted: true
        },
      });
    } else {
      // Room still exists
      res.json({
        success: true,
        data: {
          roomId: room.roomId,
          message: "Successfully left the room",
          participants: room.participants,
          currentRound: room.currentRound,
          roundStats: room.getRoundStats(),
          deleted: false
        },
      });
    }
  } catch (error) {
    console.error("Error leaving room:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get room details
const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.query; // Optional userId to check permissions

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.json({
      success: true,
      data: {
        roomId: room.roomId,
        name: room.name,
        createdBy: room.createdBy,
        participants: room.participants,
        currentRound: room.currentRound,
        roundStats: room.getRoundStats(),
        canControlRounds: userId ? room.canControlRounds(userId) : false,
        createdAt: room.createdAt,
      },
    });
  } catch (error) {
    console.error("Error getting room:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Next round (creator only)
const nextRound = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check if user is the creator
    if (!room.canControlRounds(userId)) {
      return res.status(403).json({
        success: false,
        message: "Only the room creator can control rounds",
      });
    }

    // Create new round
    await room.createNewRound();

    res.json({
      success: true,
      data: {
        roomId: room.roomId,
        currentRound: room.currentRound,
        roundStats: room.getRoundStats(),
        message: `Round ${room.currentRound} started`,
      },
    });
  } catch (error) {
    console.error("Error creating next round:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Reset current round (creator only)
const resetRound = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check if user is the creator
    if (!room.canControlRounds(userId)) {
      return res.status(403).json({
        success: false,
        message: "Only the room creator can control rounds",
      });
    }

    // Reset current round
    await room.resetCurrentRound();

    res.json({
      success: true,
      data: {
        roomId: room.roomId,
        currentRound: room.currentRound,
        roundStats: room.getRoundStats(),
        message: `Round ${room.currentRound} reset`,
      },
    });
  } catch (error) {
    console.error("Error resetting round:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get round history
const getRoundHistory = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Return round history (only revealed rounds)
    const roundHistory = room.rounds
      .filter((round) => round.isRevealed)
      .map((round) => ({
        roundNumber: round.roundNumber,
        votes: round.votes.map((vote) => ({
          userId: vote.userId,
          value: vote.value,
          timestamp: vote.timestamp,
        })),
        revealedAt: round.revealedAt,
        totalVotes: round.votes.length,
      }));

    res.json({
      success: true,
      data: {
        roomId: room.roomId,
        roundHistory,
        totalRounds: room.rounds.length,
      },
    });
  } catch (error) {
    console.error("Error getting round history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all rooms
const getAllRooms = async (_, res) => {
  try {
    const rooms = await Room.find({}).select('roomId name createdBy participants currentRound createdAt');
    
    res.json({
      success: true,
      data: rooms.map(room => ({
        roomId: room.roomId,
        name: room.name,
        createdBy: room.createdBy,
        participants: room.participants,
        currentRound: room.currentRound,
        createdAt: room.createdAt,
        participantCount: room.participants.length
      }))
    });
  } catch (error) {
    console.error("Error getting all rooms:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllRooms,
  createRoom,
  joinRoom,
  getRoom,
  nextRound,
  resetRound,
  getRoundHistory,
  leaveRoom,
};
