import { AxiosRequestConfig } from "axios";
import React, { useEffect } from "react";
import apiClient from "../../state/apiClient";
import { FETCH_VALIDATORS_REMOTE_URL_URL, REMOTE_VALIDATORS_STATUS_URL } from "../../state/ducks/auth/constants";
import { store } from "../../state/store";
import { CompanyValidators } from "./interfaces";
import { RemoteValidatorHelper } from "./remoteValidatorsHelper";

export const fetchRemoteValidatorsStatus = async () => {
  const requestConfig: AxiosRequestConfig = {
    method: "get",
    url: REMOTE_VALIDATORS_STATUS_URL,
    headers: {},
  };

  requestConfig.headers.Authorization = `bearer ${
    store.getState().auth.user.employeeId
  }:${store.getState().auth.user.sessionId}`;

  const { data } = await apiClient.request(requestConfig);
  return data;
};

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
    await import(/* webpackIgnore: true */ data.url);
    // (window as any).EnlilValidatorInstance = new (window as any).EnlilRemoteValidators();
    (window as any).EnlilRemoteValidators.registerHelperCallback(() => RemoteValidatorHelper);
  } catch (exception) {}
};

export const getRemoteValidatorBundle: () => Promise<CompanyValidators> = async () => {
  // debugger;
  if ((window as any).EnlilRemoteValidators) {
    return (window as any).EnlilRemoteValidators;
  }
  await fetchRemoteValidators();
  return (window as any).EnlilRemoteValidators;
};

const RemoteValidatorsLoader: React.FunctionComponent<{}> = () => {
  useEffect(() => {
    fetchRemoteValidators();
  }, []);

  return null;
};

export default RemoteValidatorsLoader;
