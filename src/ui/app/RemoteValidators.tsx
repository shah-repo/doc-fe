import { AxiosRequestConfig } from "axios";
import React, { useEffect } from "react";
import Config from "../../config";
import apiClient from "../../state/apiClient";
import { FETCH_VALIDATORS_REMOTE_URL_URL } from "../../state/ducks/auth/constants";
import { store } from "../../state/store";

const fetchRemoteValidators = async () => {
  try {
    const requestConfig: AxiosRequestConfig = {
      method: "get",
      url: FETCH_VALIDATORS_REMOTE_URL_URL,
      headers: {},
    };

    requestConfig.headers.Authorization = `bearer ${
      store.getState().auth.user.employeeId
    }:${store.getState().auth.user.sessionId}`;

    const { data } = await apiClient.request(requestConfig);
    await import(/* webpackIgnore: true */ Config.RemoteValidatorsPath(data.file));
    (window as any).EnlilValidatorInstance = new (window as any).EnlilRemoteValidators();
  } catch (exception) {}
};

export const getValidators = async () => {
  if ((window as any).EnlilValidatorInstance) {
    return (window as any).EnlilValidatorInstance;
  }
  await fetchRemoteValidators();
  return (window as any).EnlilValidatorInstance;
};

const RemoteValidatorsLoader: React.FunctionComponent<{}> = ({}) => {
  useEffect(() => {
    fetchRemoteValidators();
  }, []);

  return null;
};

export default RemoteValidatorsLoader;
