const dotenv = require('dotenv');

dotenv.config();

const config = {
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-keeper',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  api: {
    prefix: '/api/v1',
    rateLimitWindow: 15 * 60 * 1000,
    rateLimitMax: 100,
  },

  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

module.exports = config;
