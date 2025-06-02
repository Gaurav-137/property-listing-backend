// src/config/redis.ts

import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true, // 🔐 Required for Upstash SSL
    host: process.env.REDIS_HOST as string, // Add host property
  },
});

redis.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

redis.connect()
  .then(() => console.log('✅ Redis connected!'))
  .catch(err => console.error('❌ Redis connect error:', err));

export default redis;