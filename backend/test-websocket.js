const io = require('socket.io-client');

const socket = io('http://localhost:3001');

// Test data
const roomId = 'TEST1234'; // You can replace this with a real room ID from API test
const creatorId = 'testCreator';
const participantId = 'testParticipant';

console.log('🔌 Testing WebSocket functionality with Rounds...\n');

// Connection event
socket.on('connect', () => {
  console.log('✅ Connected to WebSocket server');
  
  // Test 1: Join room as creator
  console.log('\n1. Joining room as creator...');
  socket.emit('joinRoom', { roomId, userId: creatorId });
});

// Room joined event
socket.on('roomJoined', (data) => {
  console.log('✅ Room joined successfully:', data);
  console.log(`   Current Round: ${data.currentRound}`);
  console.log(`   Can Control Rounds: ${data.canControlRounds}`);
  
  // Test 2: Cast a vote in current round
  console.log('\n2. Casting a vote in current round...');
  socket.emit('vote', { roomId, userId: creatorId, value: '5' });
});

// Vote confirmed event
socket.on('voteConfirmed', (data) => {
  console.log('✅ Vote confirmed:', data);
  console.log(`   Round: ${data.currentRound}`);
  
  // Test 3: Get room status
  console.log('\n3. Getting room status...');
  socket.emit('getRoomStatus', { roomId });
});

// Room status event
socket.on('roomStatus', (data) => {
  console.log('✅ Room status received:', data);
  console.log(`   Current Round: ${data.currentRound}`);
  console.log(`   Round Stats:`, data.roundStats);
  
  // Test 4: Reveal votes (creator only)
  console.log('\n4. Revealing votes (creator)...');
  socket.emit('revealVotes', { roomId, userId: creatorId });
});

// Votes revealed event
socket.on('votesRevealed', (data) => {
  console.log('✅ Votes revealed:', data);
  console.log(`   Round: ${data.currentRound}`);
  console.log(`   Votes:`, data.votes);
  
  // Test 5: Next round (creator only)
  console.log('\n5. Creating next round (creator)...');
  socket.emit('nextRound', { roomId, userId: creatorId });
});

// Next round event
socket.on('nextRound', (data) => {
  console.log('✅ Next round created:', data);
  console.log(`   New Round: ${data.currentRound}`);
  
  // Test 6: Cast vote in new round
  console.log('\n6. Casting vote in new round...');
  socket.emit('vote', { roomId, userId: creatorId, value: '8' });
});

// Vote confirmed in new round
socket.on('voteConfirmed', (data) => {
  if (data.currentRound > 1) {
    console.log('✅ Vote confirmed in new round:', data);
    
    // Test 7: Reset round (creator only)
    console.log('\n7. Resetting current round (creator)...');
    socket.emit('resetRound', { roomId, userId: creatorId });
  }
});

// Round reset event
socket.on('roundReset', (data) => {
  console.log('✅ Round reset:', data);
  console.log(`   Round: ${data.currentRound}`);
  
  // Test 8: Get round history
  console.log('\n8. Getting round history...');
  socket.emit('getRoundHistory', { roomId });
});

// Round history event
socket.on('roundHistory', (data) => {
  console.log('✅ Round history received:', data);
  console.log(`   Total Rounds: ${data.totalRounds}`);
  console.log(`   History:`, data.roundHistory);
  
  console.log('\n🎉 All WebSocket tests completed successfully!');
  
  // Disconnect after tests
  setTimeout(() => {
    socket.disconnect();
    process.exit(0);
  }, 1000);
});

// Error handling
socket.on('error', (data) => {
  console.error('❌ WebSocket error:', data);
});

socket.on('disconnect', () => {
  console.log('🔌 Disconnected from WebSocket server');
});

// Handle process termination
process.on('SIGINT', () => {
  socket.disconnect();
  process.exit(0);
}); 