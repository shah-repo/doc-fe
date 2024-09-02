import { AxiosRequestConfig } from 'axios';
import apiClient from '../../state/apiClient';
import { VALIDATORS_HELPER_REMOTE_URL_URL } from '../../state/ducks/auth/constants';
import { store } from '../../state/store';
import { IRemoteValidatorsHelper } from './interfaces';

const ongoingRequests = new Map<string, Promise<any>>();

const doApiRequest = async (name: string, args: any[]) => {
  const requestKey = `${name}-${JSON.stringify(args)}`;

  if (ongoingRequests.has(requestKey)) {
    return await ongoingRequests.get(requestKey);
  }

  try {
    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: VALIDATORS_HELPER_REMOTE_URL_URL,
      data: { name, args },
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };

    const requestPromise = apiClient.request(requestConfig)
      .then(({ data }) => {
        console.log('Fetching data', data);
        return data;
      })
      .catch(error => {
        throw new Error(`HTTP REQUEST FOR VALIDATORS FAILED: ${error.message}`);
      })
      .finally(() => {
        ongoingRequests.delete(requestKey);
      });
    ongoingRequests.set(requestKey, requestPromise);

    return await requestPromise;
  } catch (error) {
    throw new Error('Unexpected error in doApiRequest');
  }
};

export const RemoteValidatorHelper = new Proxy(
  {},
  {
    get (_obj, name) {
      return async (...args: any[]) => await doApiRequest(name as string, args);
    },
  },
) as IRemoteValidatorsHelper;
