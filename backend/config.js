require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Please set these variables in your Render dashboard or .env file');
  process.exit(1);
}

module.exports = {
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV || 'development'
}; 