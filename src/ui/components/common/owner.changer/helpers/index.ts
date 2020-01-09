import { AxiosRequestConfig } from "axios";
import apiClient from "../../../../../state/apiClient";
import { changeRequestsSelectors } from "../../../../../state/ducks/changeRequest";
import { CHANGE_REQUEST_ROOT_URL } from "../../../../../state/ducks/changeRequest/constants";
import { documentRevisionsSelectors } from "../../../../../state/ducks/documentRevisions";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../../../state/ducks/documentRevisions/constants";
import { store } from "../../../../../state/store";

export const getUrlandSelector = (requestType, requestId) => {
  const urlAction = {
    document: [
      DOCUMENT_REVISION_ROOT_URL + `/${requestId}`,
      documentRevisionsSelectors.getDocumentRevision,
    ],
    change_request: [
      CHANGE_REQUEST_ROOT_URL + `/${requestId}`,
      changeRequestsSelectors.getChangeRequest,
    ],
    task: [
      DOCUMENT_REVISION_ROOT_URL + `/implementation_plan_task/${requestId}`,
      changeRequestsSelectors.getChangeRequest,
    ],
  };

  return urlAction[requestType];
};

export const asyncRequest = async (method, url, data) => {
  const requestConfig: AxiosRequestConfig = {
    headers: {},
    method,
    url,
    data,
  };
  requestConfig.headers.Authorization = `bearer ${
    store.getState().auth.user.employeeId
  }:${store.getState().auth.user.sessionId}`;

  const response = await apiClient.request(requestConfig);
  return response;
};
