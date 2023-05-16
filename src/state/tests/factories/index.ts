import faker from 'faker';
import { AsyncState, AsyncStatus } from '../../types';

export const getAsyncState = (asyncState: Partial<AsyncState> = {}): AsyncState => ({
  status: AsyncStatus.Active,
  message: faker.lorem.sentence(),
  ...asyncState,
});
