const cors = require('cors');
const Redis = require('ioredis');
const express = require('express');
const rateLimit = require('express-rate-limit');
const {RedisStore} = require('rate-limit-redis');

const redisClient = new Redis(); // Create a Redis client
const app = express();

app.use(cors());

// Configure the rate limiter
const redisLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args), // Use Redis for storing rate limit data
  }),
  windowMs: 30 * 1000, // 30 seconds
  max: 5, // Maximum 5 requests per window
  message: { error: 'Too many requests, please try again after 30 seconds.' },
});

// Apply rate limiter to all routes
app.use(redisLimiter);

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.json({ success: 'Request successful!' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
