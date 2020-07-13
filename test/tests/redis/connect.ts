import redis from 'redis';
import asyncRedis from 'async-redis';

/**
 * Number of props to set and get
 */
const numProps = 10000;

/**
 * Connect to the Redis server
 */
export default test(`Connects to redis Server and stress it with ${numProps} gets and sets`, async (): Promise<void> => {
  const redisClient = redis.createClient();
  const asyncRedisClient = asyncRedis.decorate(redisClient);

  asyncRedisClient.on('error', (error): void => {
    // eslint-disable-next-line no-console
    console.error(error);
  });
  
  const setStressProps = async (testNumber: number): Promise<void> => {  
    const testString = `${testNumber}`;  
    await asyncRedisClient.hset('stressTest', testString, testString);
    const res = await asyncRedisClient.hget('stressTest', testString);
    expect(res).toBe(testString);
  }
  const tests = new Array(numProps).fill(0).map((_,i) => setStressProps(i));
  // eslint-disable-next-line no-console
  console.time(`Setting and getting ${numProps} props`);  
  await Promise.all(tests);
  await asyncRedisClient.expire('stressTest', 60);
  // eslint-disable-next-line no-console
  console.timeEnd(`Setting and getting ${numProps} props`);
  redisClient.end(true);
});
