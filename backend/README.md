# Scrum Poker Backend

A Node.js backend for a real-time Scrum Poker application with WebSocket support for live voting and round-based sessions.

## Features

- ✅ Create and join voting rooms
- ✅ Round-based voting system
- ✅ Real-time voting with WebSocket
- ✅ Vote reveal and round management
- ✅ Creator controls (next round, reset round)
- ✅ Round history and statistics
- ✅ MongoDB persistence
- ✅ REST API endpoints
- ✅ Error handling and validation

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - REST API framework
- **Socket.io** - Real-time WebSocket communication
- **MongoDB** - Database with Mongoose ODM
- **UUID** - Unique room ID generation

## Project Structure

```
backend/
├── config.js              # Configuration and environment variables
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── models/
│   └── Room.js           # MongoDB Room schema with rounds
├── controllers/
│   └── roomController.js  # REST API controllers
├── routes/
│   └── rooms.js          # Express routes
├── sockets/
│   └── socketHandler.js   # WebSocket event handlers
└── utils/
    └── database.js       # MongoDB connection utility
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

3. **Server will start on port 3001** (configurable via environment variables)

## API Endpoints

### REST API

#### Create Room
```http
POST /api/rooms
Content-Type: application/json

{
  "name": "Sprint Planning",
  "createdBy": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "roomId": "A1B2C3D4",
    "name": "Sprint Planning",
    "createdBy": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "participants": ["user123"],
    "currentRound": 1,
    "roundStats": {
      "roundNumber": 1,
      "totalVotes": 0,
      "isRevealed": false,
      "participants": 1
    }
  }
}
```

#### Join Room
```http
POST /api/rooms/:roomId/join
Content-Type: application/json

{
  "userId": "user456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "roomId": "A1B2C3D4",
    "name": "Sprint Planning",
    "createdBy": "user123",
    "participants": ["user123", "user456"],
    "currentRound": 1,
    "roundStats": {
      "roundNumber": 1,
      "totalVotes": 0,
      "isRevealed": false,
      "participants": 2
    },
    "canControlRounds": false
  }
}
```

#### Get Room Details
```http
GET /api/rooms/:roomId?userId=user123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "roomId": "A1B2C3D4",
    "name": "Sprint Planning",
    "createdBy": "user123",
    "participants": ["user123", "user456"],
    "currentRound": 1,
    "roundStats": {
      "roundNumber": 1,
      "totalVotes": 2,
      "isRevealed": false,
      "participants": 2
    },
    "canControlRounds": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Next Round (Creator Only)
```http
POST /api/rooms/:roomId/next-round
Content-Type: application/json

{
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "roomId": "A1B2C3D4",
    "currentRound": 2,
    "roundStats": {
      "roundNumber": 2,
      "totalVotes": 0,
      "isRevealed": false,
      "participants": 2
    },
    "message": "Round 2 started"
  }
}
```

#### Reset Round (Creator Only)
```http
POST /api/rooms/:roomId/reset-round
Content-Type: application/json

{
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "roomId": "A1B2C3D4",
    "currentRound": 1,
    "roundStats": {
      "roundNumber": 1,
      "totalVotes": 0,
      "isRevealed": false,
      "participants": 2
    },
    "message": "Round 1 reset"
  }
}
```

#### Get Round History
```http
GET /api/rooms/:roomId/history
```

**Response:**
```json
{
  "success": true,
  "data": {
    "roomId": "A1B2C3D4",
    "roundHistory": [
      {
        "roundNumber": 1,
        "votes": [
          {
            "userId": "user123",
            "value": "5",
            "timestamp": "2024-01-01T00:00:00.000Z"
          }
        ],
        "revealedAt": "2024-01-01T00:05:00.000Z",
        "totalVotes": 1
      }
    ],
    "totalRounds": 2
  }
}
```

### WebSocket Events

Connect to WebSocket server: `ws://localhost:3001`

#### Client to Server Events

**Join Room:**
```javascript
socket.emit('joinRoom', {
  roomId: 'A1B2C3D4',
  userId: 'user123'
});
```

**Cast Vote:**
```javascript
socket.emit('vote', {
  roomId: 'A1B2C3D4',
  userId: 'user123',
  value: '5'
});
```

**Reveal Votes (Creator Only):**
```javascript
socket.emit('revealVotes', {
  roomId: 'A1B2C3D4',
  userId: 'user123'
});
```

**Next Round (Creator Only):**
```javascript
socket.emit('nextRound', {
  roomId: 'A1B2C3D4',
  userId: 'user123'
});
```

**Reset Round (Creator Only):**
```javascript
socket.emit('resetRound', {
  roomId: 'A1B2C3D4',
  userId: 'user123'
});
```

**Get Room Status:**
```javascript
socket.emit('getRoomStatus', {
  roomId: 'A1B2C3D4'
});
```

**Get Round History:**
```javascript
socket.emit('getRoundHistory', {
  roomId: 'A1B2C3D4'
});
```

#### Server to Client Events

**Room Joined:**
```javascript
socket.on('roomJoined', (data) => {
  console.log('Joined room:', data);
  // data: { roomId, participants, currentRound, roundStats, canControlRounds }
});
```

**User Joined:**
```javascript
socket.on('userJoined', (data) => {
  console.log('New user joined:', data);
  // data: { userId, participants, currentRound, roundStats }
});
```

**Vote Confirmed:**
```javascript
socket.on('voteConfirmed', (data) => {
  console.log('Vote confirmed:', data);
  // data: { userId, value, currentRound }
});
```

**Votes Updated:**
```javascript
socket.on('votesUpdated', (data) => {
  console.log('Someone voted:', data);
  // data: { userId, hasVoted, currentRound, roundStats }
});
```

**Votes Revealed:**
```javascript
socket.on('votesRevealed', (data) => {
  console.log('Votes revealed:', data);
  // data: { votes, participants, currentRound, roundStats }
});
```

**Next Round:**
```javascript
socket.on('nextRound', (data) => {
  console.log('Next round started:', data);
  // data: { currentRound, roundStats, participants }
});
```

**Round Reset:**
```javascript
socket.on('roundReset', (data) => {
  console.log('Round reset:', data);
  // data: { currentRound, roundStats, participants }
});
```

**Room Status:**
```javascript
socket.on('roomStatus', (data) => {
  console.log('Room status:', data);
  // data: { roomId, name, participants, currentRound, roundStats, canControlRounds }
});
```

**Round History:**
```javascript
socket.on('roundHistory', (data) => {
  console.log('Round history:', data);
  // data: { roomId, roundHistory, totalRounds }
});
```

**Error:**
```javascript
socket.on('error', (data) => {
  console.error('Socket error:', data);
  // data: { message }
});
```

## Database Schema

### Room Collection
```javascript
{
  roomId: String,           // Unique 8-character room code
  name: String,             // Room name
  createdBy: String,        // Creator's user ID
  createdAt: Date,          // Creation timestamp
  participants: [String],   // Array of user IDs
  currentRound: Number,     // Current round number
  rounds: [                 // Array of rounds
    {
      roundNumber: Number,
      votes: [              // Array of votes in this round
        {
          userId: String,
          value: String,
          timestamp: Date
        }
      ],
      isRevealed: Boolean,
      createdAt: Date,
      revealedAt: Date
    }
  ],
  isActive: Boolean,        // Room status
  updatedAt: Date,          // Last update timestamp
  createdAt: Date           // Creation timestamp
}
```

## Round Management

### Round Flow
1. **Room Creation**: Automatically creates Round 1
2. **Voting**: Participants cast votes in current round
3. **Reveal**: Creator reveals votes (optional)
4. **Next Round**: Creator starts new round
5. **Reset**: Creator resets current round (clears votes)

### Creator Controls
- Only the room creator can:
  - Reveal votes
  - Start next round
  - Reset current round
- Participants can only vote

### Round Statistics
Each round tracks:
- Round number
- Total votes cast
- Reveal status
- Participant count
- Vote timestamps

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scrum-poker
NODE_ENV=development
```

## Error Handling

The application includes comprehensive error handling for:

- Invalid room IDs
- User not found in room
- Voting after reveal
- Unauthorized round control
- Database connection issues
- WebSocket connection errors

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running Tests
```bash
# Test REST API
npm run test:api

# Test WebSocket functionality
npm run test:websocket
```

### Production Build
```bash
npm start
```

## Future Enhancements

- [ ] Moderator role assignment
- [ ] Session history and reporting
- [ ] User authentication
- [ ] Room templates
- [ ] Vote statistics and analytics
- [ ] Custom voting scales
- [ ] Room timeouts
- [ ] Export functionality
- [ ] Round comments/notes
- [ ] Vote consensus detection

## License

ISC 