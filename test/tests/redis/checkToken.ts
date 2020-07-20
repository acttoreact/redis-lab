import {generateToken, useToken, AccessInfo, disconnect} from '../../../lib/tokenManager';

/**
 * Connect to the Redis server
 */
export default test(`Check the token store in Redis`, async (): Promise<void> => {
  const accessInfo: AccessInfo = {
    ISBN: '1231231231',
    userID: 'asd',
  }
  const randomToken = await useToken<AccessInfo>('342i3ui434');
  expect(randomToken).toBeNull();

  const token = await generateToken<AccessInfo>(accessInfo);
  const obtainedToken = await useToken<AccessInfo>(token);
  expect(obtainedToken.userID).toBe(accessInfo.userID);
  expect(obtainedToken.ISBN).toBe(accessInfo.ISBN);

  const reusedToken = await useToken<AccessInfo>(token);
  expect(reusedToken).toBeNull();
  
  disconnect();
});
