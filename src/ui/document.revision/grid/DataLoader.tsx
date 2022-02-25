import { toODataString } from "@progress/kendo-data-query";
import axios, { AxiosRequestConfig } from "axios";
import { cloneDeep } from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import apiClient from "../../../state/apiClient";
import { authActions } from "../../../state/ducks/auth";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import { getDefaultPayloadItems, getDynamicPayloadItems, getQueryURL, updateDataState } from "./DataLoader.util";
import { DataLoaderProps } from "./interfaces";

export const DataLoader = ({ dataState, onDataReceived, schema, tableName, tableCriteria }: DataLoaderProps) => {
  const updatedDataState = updateDataState(cloneDeep(dataState));
  const defaultPayloadItems = getDefaultPayloadItems(tableName);
  const dispatch = useDispatch();
  let data = {
    ...defaultPayloadItems,
    limit: updatedDataState.take,
    offset: updatedDataState.skip,
    filters: updatedDataState.filter?.filters,
    sort: updatedDataState.sort,
    schema,
  };
  data = getDynamicPayloadItems(tableName, data);
  const requestConfig: AxiosRequestConfig = {
    method: "post",
    url: getQueryURL(tableName),
    data,
    headers: {},
  };
  requestConfig.headers.Authorization = `bearer ${
    store.getState().auth.user.employeeId
  }:${store.getState().auth.user.sessionId}`;

  const lastSuccess = React.useRef<string>("");
  const pending = React.useRef<string>("");

  const requestDataIfNeeded = () => {
    if (
      (pending.current ||
      toODataString(updatedDataState) === lastSuccess.current)
    ) {
      return;
    }
    pending.current = toODataString(updatedDataState);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          apiError: "",
        },
        tableName
      )
    );
    apiClient
      .request(requestConfig)
      .then(({ data }) => {
        lastSuccess.current = pending.current;
        pending.current = "";
        if (toODataString(updatedDataState) === lastSuccess.current) {
          onDataReceived.call(undefined, {
            data: data.results,
            total: data.total,
          });
        } else {
          requestDataIfNeeded();
        }
      }).catch((exception) => {
        if (axios.isCancel(exception)) {
          return;
        }
        let responseMessage = "";
        lastSuccess.current = pending.current;
        pending.current = "";
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
            ? message.join("; ")
            : message;
        }

        dispatch(
          tableSearchActions.setSearchCriteria(
            {
              ...tableCriteria,
              apiError: "Error: " + responseMessage || exception.message,
            },
            tableName
          )
        );
      });
  };
  requestDataIfNeeded();
  return pending.current ? <LoadingPanel /> : null;
};

const LoadingPanel = () => {
  const loadingPanel = (
    <div className="k-loading-mask">
      <span className="k-loading-text">Loading</span>
      <div className="k-loading-image" />
      <div className="k-loading-color" />
    </div>
  );

  const gridContent = document && document.querySelector(".k-grid-content");
  return gridContent
    ? ReactDOM.createPortal(loadingPanel, gridContent)
    : loadingPanel;
};
