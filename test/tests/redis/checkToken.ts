import {pushToken, popToken, AccessInfo, disconnect} from '../../../lib/tokenManager';

/**
 * Connect to the Redis server
 */
export default test(`Check the token store in Redis`, async (): Promise<void> => {
  const accessInfo: AccessInfo = {
    ISBN: '1231231231',
    userID: 'asd',
  };
  
  const randomToken = await popToken<AccessInfo>('342i3ui434');
  expect(randomToken).toBeNull();

  const token = await pushToken<AccessInfo>(accessInfo);
  const obtainedToken = await popToken<AccessInfo>(token);
  expect(obtainedToken.userID).toBe(accessInfo.userID);
  expect(obtainedToken.ISBN).toBe(accessInfo.ISBN);

  const reusedToken = await popToken<AccessInfo>(token);
  expect(reusedToken).toBeNull();
  
  disconnect();
});
