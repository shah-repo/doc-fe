import { AxiosRequestConfig } from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import apiClient from '../../state/apiClient';
import { authSelectors } from '../../state/ducks/auth';
import { FETCH_VALIDATORS_REMOTE_URL_URL, REMOTE_VALIDATORS_STATUS_URL } from '../../state/ducks/auth/constants';
import { REMOTE_VALIDATOR_GET_ASYNC } from '../../state/ducks/documentRevisions/constants';
import { store } from '../../state/store';
import { AsyncAction, AsyncStatus } from '../../state/types';
import { RemoteValidatorHelper } from './remoteValidatorsHelper';

export const fetchRemoteValidatorsStatus = async () => {
  const requestConfig: AxiosRequestConfig = {
    method: 'get',
    url: REMOTE_VALIDATORS_STATUS_URL,
    headers: {},
  };

  const { data } = await apiClient.request(requestConfig);
  return data;
};

const fetchRemoteValidators = async (onSuccess) => {
  try {
    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: FETCH_VALIDATORS_REMOTE_URL_URL,
      headers: {},
    };

    requestConfig.headers.Authorization = `bearer ${
      store.getState().auth.user.employeeId
    }:${store.getState().auth.user.sessionId}`;

    const { data } = await apiClient.request(requestConfig);
    await import(/* webpackIgnore: true */ data.url);
    onSuccess();
    // (window as any).EnlilValidatorInstance = new (window as any).EnlilRemoteValidators();
    (window as any).EnlilRemoteValidators.registerHelperCallback(() => RemoteValidatorHelper);
  } catch (exception) {}
};

const RemoteValidatorsLoader: React.FunctionComponent<{}> = () => {
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const dispatch = useDispatch();
  const action: AsyncAction = { type: REMOTE_VALIDATOR_GET_ASYNC, payload: { status: AsyncStatus.Active } };

  const onSuccess = () => {
    dispatch({ ...action, payload: { status: AsyncStatus.Success } });
  };

  useEffect(() => {
    if (currentEmployeeId) {
      dispatch(action);
      fetchRemoteValidators(onSuccess);
    }
  }, [currentEmployeeId]);

  return null;
};

export default RemoteValidatorsLoader;
