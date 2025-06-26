require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Please set these variables in your Render dashboard or .env file');
  process.exit(1);
}

// Environment-based configuration
const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV || 'development',
  // CORS configuration for different environments
  CORS_ORIGIN: isDevelopment 
    ? ['http://localhost:5173', 'http://localhost:3000'] 
    : ['https://scrum-poker-9c6i.onrender.com', 'https://your-frontend-domain.com'],
  // Frontend URL for different environments
  FRONTEND_URL: isDevelopment 
    ? 'http://localhost:5173' 
    : 'https://scrum-poker-9c6i.onrender.com'
}; 