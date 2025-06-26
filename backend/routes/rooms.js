const express = require('express');
const router = express.Router();
const { 
  getAllRooms,
  createRoom, 
  joinRoom, 
  leaveRoom,
  getRoom, 
  nextRound, 
  resetRound, 
  getRoundHistory 
} = require('../controllers/roomController');

// Get all rooms
router.get('/', getAllRooms);

// Create a new room
router.post('/', createRoom);

// Join an existing room
router.post('/:roomId/join', joinRoom);

// Leave a room
router.post('/:roomId/leave', leaveRoom);

// Get room details
router.get('/:roomId', getRoom);

// Round control (creator only)
router.post('/:roomId/next-round', nextRound);
router.post('/:roomId/reset-round', resetRound);

// Get round history
router.get('/:roomId/history', getRoundHistory);

module.exports = router; 