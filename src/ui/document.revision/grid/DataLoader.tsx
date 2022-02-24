import { toODataString } from "@progress/kendo-data-query";
import { AxiosRequestConfig } from "axios";
import * as React from "react";
import * as ReactDOM from "react-dom";
import apiClient from "../../../state/apiClient";
import { store } from "../../../state/store";
import { getDefaultPayloadItems, getDynamicPayloadItems, getQueryURL } from "./DataLoader.util";
import { DataLoaderProps } from "./interfaces";

export const DataLoader = ({ dataState, onDataReceived, schema, tableName }: DataLoaderProps) => {
  const defaultPayloadItems = getDefaultPayloadItems(tableName);
  const data = {
    ...defaultPayloadItems,
    limit: dataState.take,
    offset: dataState.skip,
    filters: dataState.filter?.filters,
    sort: dataState.sort,
    schema,
  };
  getDynamicPayloadItems(tableName, data);
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
      pending.current ||
      toODataString(dataState) === lastSuccess.current
    ) {
      return;
    }
    pending.current = toODataString(dataState);
    apiClient
      .request(requestConfig)
      .then(({ data }) => {
        lastSuccess.current = pending.current;
        pending.current = "";
        if (toODataString(dataState) === lastSuccess.current) {
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
