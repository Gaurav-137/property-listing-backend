import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL || 'rediss://default:Aa0zAAIjcDExZmZmMGRlODJjZjU0ZDAwYjZjNzEwMWRmZjQ1MWU3ZHAxMA@divine-stingray-44339.upstash.io:6379'
});

redis.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }
})();

export default redis;
