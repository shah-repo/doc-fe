import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { ASYNC_TASK, ASYNC_TASK_SESSION_TIME_TRAVEL } from './constants';
import { PasswordType } from './types';

const executeAsyncTask = (payload: PasswordType, handlers: Handlers): ApiAction => {
  const { password, ...restPayload } = payload;
  return apiActionWithCallbacks({
    url: ASYNC_TASK,
    method: 'post',
    password,
    data: restPayload,
    handlers,
  }); };

const executeSessionTimeTravelAsyncTask = (payload: PasswordType, handlers: Handlers): ApiAction => {
  const { password, ...restPayload } = payload;
  return apiActionWithCallbacks({
    url: ASYNC_TASK_SESSION_TIME_TRAVEL,
    method: 'patch',
    password,
    data: restPayload,
    handlers,
  }); };

export default {
  executeAsyncTask,
  executeSessionTimeTravelAsyncTask,
};
