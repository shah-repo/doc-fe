import { toODataString } from "@progress/kendo-data-query";
import { AxiosRequestConfig } from "axios";
import { cloneDeep } from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import apiClient from "../../../state/apiClient";
import { store } from "../../../state/store";
import { getDefaultPayloadItems, getDynamicPayloadItems, getQueryURL, updateDataState } from "./DataLoader.util";
import { DataLoaderProps } from "./interfaces";

export const DataLoader = ({ dataState, onDataReceived, schema, tableName }: DataLoaderProps) => {
  const updatedDataState = updateDataState(cloneDeep(dataState));
  const defaultPayloadItems = getDefaultPayloadItems(tableName);
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
  const odString = `${toODataString(updatedDataState)}&$table="${tableName}"`;
  const requestDataIfNeeded = () => {
    if (pending.current || odString === lastSuccess.current) {
      return;
    }
    pending.current = odString;
    apiClient
      .request(requestConfig)
      .then(({ data }) => {
        lastSuccess.current = pending.current;
        pending.current = "";
        if (odString === lastSuccess.current) {
          onDataReceived.call(undefined, {
            data: data.results,
            total: data.total,
          });
        } else {
          requestDataIfNeeded();
        }
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
