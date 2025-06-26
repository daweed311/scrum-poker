require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://fiatecomstores:nDeukuuO4cFPvqkJ@cluster0.g8qqvtv.mongodb.net/scrum-poker?retryWrites=true&w=majority&appName=Cluster0",
  NODE_ENV: process.env.NODE_ENV || 'development'
}; 