import redis from 'redis';
import asyncRedis from 'async-redis';
import shortid from 'shortid';

/**
 * Connect to the Redis server
 */
const redisClient = redis.createClient();
const asyncRedisClient = asyncRedis.decorate(redisClient);

asyncRedisClient.on('error', (error): void => {
  // eslint-disable-next-line no-console
  console.error(error);
});

export interface AccessInfo {
  ISBN: string;
  userID: string;
}

const getKeyFromToken = (token: string): string => `prh.access.token.${token}`;

export const registerToken = async (info: AccessInfo): Promise<string> => {
  const token = shortid.generate();
  const key = getKeyFromToken(token);
  const value = JSON.stringify(info);
  await asyncRedisClient.set(key , value);
  // Expires in 60 seconds
  await asyncRedisClient.expire(key , 60);
  return token;
}

export const useToken = async (token: string): Promise<AccessInfo> => {
  const key = getKeyFromToken(token);
  const value =  await asyncRedisClient.get(key) as unknown as string;
  await asyncRedisClient.del(key);
  return JSON.parse(value) as AccessInfo;
}

export const disconnect = (): void => {
  redisClient.end(true);
}