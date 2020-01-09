import { AxiosRequestConfig } from 'axios';
import React, { useEffect, useState } from 'react';
import apiClient from '../../../../state/apiClient';
import { EMPLOYEES_URL } from '../../../../state/ducks/userManagement/constants';
import { store } from '../../../../state/store';
import OwnerChangerPresenter from './presenter';
import { DOCUMENT_REVISION_ROOT_URL } from '../../../../state/ducks/documentRevisions/constants';
import { CHANGE_REQUEST_ROOT_URL } from '../../../../state/ducks/changeRequest/constants';
import { documentsSelectors } from '../../../../state/ducks/documents';
import { documentRevisionsSelectors } from '../../../../state/ducks/documentRevisions';
import { changeRequestsSelectors } from '../../../../state/ducks/changeRequest';

// import useAsync from "../../../hooks/useAsync";

export interface OwnProps {
  requestId: string;
  requestType: string;
}

const OwnerChangerContainer: React.FC<OwnProps> = ({
  requestId,
  requestType,
}) => {
  const [employees, setEmployees] = useState([]);

  const getUrlandAction = requestType => {
    const urlAction = {
      document: [
        DOCUMENT_REVISION_ROOT_URL,
        documentRevisionsSelectors.getDocumentRevision,
      ],
      change_request: [
        CHANGE_REQUEST_ROOT_URL,
        changeRequestsSelectors.getChangeRequest,
      ],
      task: [DOCUMENT_REVISION_ROOT_URL, documentsSelectors.getDocument],
    };

    return urlAction[requestType];
  };

  const [url, action] = getUrlandAction(requestType);
  const currentId = action(requestId);
  console.log(url, currentId);

  // const async = useAsync();
  const updateOwner = async () => {
    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: requestType,
      headers: {},
    };

    requestConfig.headers.Authorization = `bearer ${
      store.getState().auth.user.employeeId
    }:${store.getState().auth.user.sessionId}`;
  };

  const queryEmployees = async () => {
    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: EMPLOYEES_URL,
      headers: {},
    };

    requestConfig.headers.Authorization = `bearer ${
      store.getState().auth.user.employeeId
    }:${store.getState().auth.user.sessionId}`;

    const { data } = await apiClient.request(requestConfig);

    setEmployees(
      data.map(employee => ({
        value: employee.id,
        text: employee.user.name,
      })),
    );
  };

  useEffect(() => {
    queryEmployees();
  }, []);

  return (
    <OwnerChangerPresenter employees={employees} updateOwner={updateOwner} />
  );
};

export default OwnerChangerContainer;
