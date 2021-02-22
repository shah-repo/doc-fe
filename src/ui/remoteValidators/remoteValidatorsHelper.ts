import { AxiosRequestConfig } from "axios";
import apiClient from "../../state/apiClient";
import { VALIDATORS_HELPER_REMOTE_URL_URL } from "../../state/ducks/auth";
import { store } from "../../state/store";
import { IRemoteValidatorsHelper } from "./interfaces";

const doApiRequest = async (name: string, args: any[]) => {
  try {
    const requestConfig: AxiosRequestConfig = {
      method: "post",
      url: VALIDATORS_HELPER_REMOTE_URL_URL,
      data: {
        name,
        args,
      },
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${
          store.getState().auth.user.sessionId
        }`,
      },
    };

    const { data } = await apiClient.request(requestConfig);
    // eslint-disable-next-line no-console
    console.log("doApiRequest response", data);
    return data;
  } catch (error) {
    throw new Error("HTTP REQUEST FOR VALIDATORS FAILED");
  }
};

export const RemoteValidatorHelper = new Proxy(
  {},
  {
    get(_obj, name) {
      return (...args: any[]) => doApiRequest(name as string, args);
    },
  },
) as IRemoteValidatorsHelper;
