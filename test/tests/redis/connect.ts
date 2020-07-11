import redis from 'redis';
import asyncRedis from 'async-redis';

/**
 * Connect to the Redis server
 */
export default test('Connects to redis Server', async (): Promise<void> => {
  const redisClient = redis.createClient();
  const asyncRedisClient = asyncRedis.decorate(redisClient);

  asyncRedisClient.on('error', (error): void => {
    // eslint-disable-next-line no-console
    console.error(error);
  });

  await asyncRedisClient.set('test', 'allOK');
  const res = await asyncRedisClient.get('test');
  expect(res).toBe('allOK');
  redisClient.end(true);
});
