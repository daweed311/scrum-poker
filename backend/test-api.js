const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testAPI() {
  try {
    console.log('🧪 Testing Scrum Poker Backend API...\n');

    // Test 1: Create a room
    console.log('1. Creating a room...');
    const createResponse = await axios.post(`${BASE_URL}/rooms`, {
      name: 'Test Sprint Planning',
      createdBy: 'testUser123'
    });
    
    const roomId = createResponse.data.data.roomId;
    console.log(`✅ Room created with ID: ${roomId}\n`);

    // Test 2: Get room details
    console.log('2. Getting room details...');
    const getResponse = await axios.get(`${BASE_URL}/rooms/${roomId}`);
    console.log(`✅ Room details retrieved: ${getResponse.data.data.name}\n`);

    // Test 3: Join room
    console.log('3. Joining room...');
    const joinResponse = await axios.post(`${BASE_URL}/rooms/${roomId}/join`, {
      userId: 'testUser456'
    });
    console.log(`✅ User joined room. Participants: ${joinResponse.data.data.participants.join(', ')}`);
    console.log(`   Can Control Rounds: ${joinResponse.data.data.canControlRounds}\n`);

    // Test 4: Next round (creator only)
    console.log('4. Creating next round (creator)...');
    const nextRoundResponse = await axios.post(`${BASE_URL}/rooms/${roomId}/next-round`, {
      userId: 'testUser123' // Creator
    });
    console.log(`✅ Next round created: Round ${nextRoundResponse.data.data.currentRound}\n`);

    // Test 5: Try next round with non-creator (should fail)
    console.log('5. Trying next round with non-creator (should fail)...');
    try {
      await axios.post(`${BASE_URL}/rooms/${roomId}/next-round`, {
        userId: 'testUser456' // Non-creator
      });
    } catch (error) {
      console.log(`✅ Correctly rejected: ${error.response.data.message}\n`);
    }

    // Test 6: Reset round (creator only)
    console.log('6. Resetting current round (creator)...');
    const resetResponse = await axios.post(`${BASE_URL}/rooms/${roomId}/reset-round`, {
      userId: 'testUser123' // Creator
    });
    console.log(`✅ Round reset: ${resetResponse.data.message}\n`);

    // Test 7: Get round history
    console.log('7. Getting round history...');
    const historyResponse = await axios.get(`${BASE_URL}/rooms/${roomId}/history`);
    console.log(`✅ Round history retrieved. Total rounds: ${historyResponse.data.data.totalRounds}\n`);

    // Test 8: Health check
    console.log('8. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log(`✅ Health check passed: ${healthResponse.data.status}\n`);

    console.log('🎉 All API tests passed successfully!');
    console.log(`📝 Room ID for WebSocket testing: ${roomId}`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI; 