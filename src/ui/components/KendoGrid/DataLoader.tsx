import { toODataString } from '@progress/kendo-data-query';
import axios, { AxiosRequestConfig } from 'axios';
import { cloneDeep } from 'lodash';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import apiClient from '../../../state/apiClient';
import { authActions } from '../../../state/ducks/auth';
import { tableSearchActions } from '../../../state/ducks/tableSearch';
import { AsyncActionErrorResponse } from '../../../state/middlewares/api/types';
import { store } from '../../../state/store';
import Loader from '../common/kendo/Loader';
import { getDynamicPayloadItems, updateDataState } from './DataLoader.util';
import { DataLoaderProps } from './interfaces';

export const DataLoader: React.FC<DataLoaderProps> = ({
  dataState,
  onDataReceived,
  schema,
  tableName,
  queryUrl,
  defaultPayloadData,
  documentTypeCategory,
  tableCriteria,
}) => {
  const updatedDataState = updateDataState(cloneDeep(dataState));
  const dispatch = useDispatch();
  let data = {
    ...defaultPayloadData,
    limit: updatedDataState.take,
    offset: updatedDataState.skip,
    filters: updatedDataState.filter?.filters,
    sort: updatedDataState.sort,
    schema,
  } as object;

  if (documentTypeCategory) {
    data = { ...data, documentTypeCategory };
  }
  data = getDynamicPayloadItems(queryUrl, data);
  const requestConfig: AxiosRequestConfig = {
    method: 'post',
    url: queryUrl,
    data,
    headers: {},
  };
  requestConfig.headers.Authorization = `bearer ${
    store.getState().auth.user.employeeId
  }:${store.getState().auth.user.sessionId}`;

  const lastSuccess = React.useRef<string>('');
  const pending = React.useRef<string>('');
  const odString = `${toODataString(updatedDataState)}&$table="${tableName}"`;

  React.useEffect(() => {
    if (tableCriteria.forceUpdate) {
      requestDataIfNeeded(tableCriteria.forceUpdate);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableCriteria.forceUpdate]);

  const requestDataIfNeeded = (flag?: boolean) => {
    if (!flag && (pending.current || odString === lastSuccess.current)) {
      return;
    }
    pending.current = odString;
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          forceUpdate: false,
          apiError: '',
        },
        tableName,
      ),
    );
    apiClient
      .request(requestConfig)
      .then(({ data }) => {
        lastSuccess.current = pending.current;
        pending.current = '';
        if (odString === lastSuccess.current) {
          onDataReceived.call(
            undefined,
            {
              data: data.results,
              total: data.total,
            },
            {
              sort: data.sort,
              filter: data.filter,
              skip: data.offset,
              take: data.limit,
              group: dataState.group,
            },
          );
        } else {
          requestDataIfNeeded();
        }
      }).catch((exception) => {
        if (axios.isCancel(exception)) {
          return;
        }
        let responseMessage = '';
        lastSuccess.current = pending.current;
        pending.current = '';
        const isUnauthorizedRequest = exception.response?.status === 401;

        if (isUnauthorizedRequest) {
          dispatch(authActions.logoutUser());
          return;
        }

        if (exception.response) {
          const {
            data: { message },
          } = exception.response as AsyncActionErrorResponse;
          responseMessage = Array.isArray(message)
            ? message.join('; ')
            : message;
        }

        dispatch(
          tableSearchActions.setSearchCriteria(
            {
              ...tableCriteria,
              apiError: 'Error: ' + (responseMessage ?? exception.message),
            },
            tableName,
          ),
        );
      });
  };
  requestDataIfNeeded();
  return pending.current ? <Loader /> : null;
};
