import { AxiosRequestConfig } from "axios";
import React from "react";
import apiClient from "../../../../state/apiClient";
import { EMPLOYEES_URL } from "../../../../state/ducks/userManagement/constants";
import { store } from "../../../../state/store";
import OwnerChangerPresenter from "./presenter";

export interface OwnProps {
  requestId: string;
  ownerId: string;
}

const OwnerChangerContainer: React.FC<OwnProps> = ({ requestId, ownerId }) => {

  const queryEmployees = async () => {
    const requestConfig: AxiosRequestConfig = {
      method: "get",
      url: EMPLOYEES_URL,
      headers: {},
    };

    requestConfig.headers.Authorization = `bearer ${
      store.getState().auth.user.employeeId
      }:${store.getState().auth.user.sessionId}`;

    const { data } = await apiClient.request(requestConfig);
    console.log(data);
  };

  return (<OwnerChangerPresenter queryEmployees={queryEmployees} />);
};

export default OwnerChangerContainer;
