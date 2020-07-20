import redis from 'redis';
import shortid from 'shortid';

/**
 * Connect to the Redis server
 */
const redisClient = redis.createClient();

redisClient.on('error', (error): void => {
  // eslint-disable-next-line no-console
  console.error(error);
});

export interface AccessInfo {
  ISBN: string;
  userID: string;
}

const getKeyFromToken = (token: string): string => `prh.access.token.${token}`;

export const pushToken = async <T>(info: T): Promise<string> => {
  const token = shortid.generate();
  const key = getKeyFromToken(token);
  const value = JSON.stringify(info);
  return new Promise<string>((resolve, reject) => {
    // Adds the value associated with the key and stores it for 60 seconds
    redisClient.set(key, value, 'EX', 60, (err, reply) => {
      if (reply === 'OK') {
        resolve(token);
      } else {
        reject(err);
      }
    });
  });
};

export const popToken = async <T>(token: string): Promise<T> => {
  const key = getKeyFromToken(token);
  return new Promise<T>((resolve, reject) => {
    // Gets the value associates with the key and removes it only using one redis transaction
    redisClient.multi()
      .get(key)
      .del(key)
      .exec((err, reply) => {
      if (reply) {
        return resolve(JSON.parse(reply[0]) as T);
      }
      if (err) reject(err);
      return resolve(null);
    });
  });
};

export const disconnect = (): void => {
  redisClient.end(true);
};
