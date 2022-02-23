import { DataResult, State, toODataString } from "@progress/kendo-data-query";
import { AxiosRequestConfig } from "axios";
import * as React from "react";
import * as ReactDOM from "react-dom";
import apiClient from "../../../state/apiClient";
import { DOCUMENT_REVISION_SEARCH_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import { store } from "../../../state/store";
import { getSchemaFromColumns } from "../../common/utils/helpers";
import gridConfiguration from "./column.definition";

interface ProductsLoaderProps {
  dataState: State;
  onDataReceived: (products: DataResult) => void;
}

export const ProductsLoader = ({ dataState, onDataReceived }: ProductsLoaderProps) => {
  const requestConfig: AxiosRequestConfig = {
    method: "post",
    url: DOCUMENT_REVISION_SEARCH_ROOT_URL,
    data: {
      documentTypeWithoutCategory: "true",
      limit: dataState.take,
      offset: dataState.skip,
      filters: dataState?.filter?.filters || [],
      sort: dataState.sort || [],
      schema: getSchemaFromColumns(gridConfiguration.columns),
    },
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
