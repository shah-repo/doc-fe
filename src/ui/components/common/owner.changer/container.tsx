import { AxiosRequestConfig } from "axios";
import React, { useEffect, useState } from "react";
import apiClient from "../../../../state/apiClient";
import { EMPLOYEES_URL } from "../../../../state/ducks/userManagement/constants";
import { store } from "../../../../state/store";
import OwnerChangerPresenter from "./presenter";

// import useAsync from "../../../hooks/useAsync";

export interface OwnProps {
  requestId: string;
  ownerId: string;
}

const OwnerChangerContainer: React.FC<OwnProps> = ({ requestId, ownerId }) => {
  const [employees, setEmployees] = useState([]);

  // const async = useAsync();
  const updateOwner = () => {};
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
    setEmployees(data);
  };

  useEffect(() => {
    queryEmployees();
  }, []);

  return (
    <OwnerChangerPresenter employees={employees} updateOwner={updateOwner} />
  );
};

export default OwnerChangerContainer;
