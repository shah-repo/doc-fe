import { Box } from "@material-ui/core";
import { AxiosRequestConfig } from "axios";
import React, { useState } from "react";
import {
  AutoSizer,
  CellMeasurerCache,
  Index,
  Size,
  Table,
} from "react-virtualized";
import apiClient from "../../../state/apiClient";
import refreshTokenOperation from "../../../state/middlewares/api/refreshToken";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import Text from "../../components/Text";
import { TableColumn } from "./column/base";
import { TableSearchDelimiter } from "./search/types";
import { styles } from "./styles";
import { TablePanelProps, TablePanelStateProps, TableStyleProps } from "./types";

type Props<T> = TablePanelProps<T>;

export const TablePanel = <T extends any>(): React.FunctionComponent<Props<T>> => ({
  tableData,
  columns,
  noRowsTranslation = "table.no.results.found",
  cellMeasure = false,
  onSelect,
  searchable = true,
  queryUrl = "",
  clearFilter,
}) => {

  const headerHeight = (searchable) ? 120 : 50;
  const styleProps: TableStyleProps = { isSelectable: (onSelect !== undefined) };
  const classes = styles(styleProps);

  const [state, setState] = useState<TablePanelStateProps<T>>({
    queryData: tableData,
    queryDict: {},
    apiError: "",
    scrollToIndex: 0,
  });

  const setQueryDict = (key: string, value: string) => {
    const dict = state.queryDict;
    (value === "") ? delete dict[key] : dict[key] = value;
    setState({...state, queryDict: dict});
  };

  const queryGetter = (key: string, value: string) => {
    if (!queryUrl) { return; }

    let finalQuery: string = TableSearchDelimiter.Main;
    const { queryDict } = state;
    setQueryDict(key, value);

    Object.keys(queryDict).map((k: string, index: number) => {
      const delimiter = (index === 0) ? "" : TableSearchDelimiter.Regular;
      finalQuery += `${delimiter}${k}=${queryDict[k]}`;
    });

    if (finalQuery === TableSearchDelimiter.Main) {
      finalQuery = "";
    }

    queryApi(finalQuery);
  };

  const queryApi = async (query: string) => {
    try {
      const requestConfig: AxiosRequestConfig = {
        method: "get",
        url: queryUrl + query,
        headers: {},
      };

      await refreshTokenOperation(store.dispatch, store.getState());
      requestConfig.headers.Authorization = store.getState().auth.tokens.id.value;

      const { data } = await apiClient.request(requestConfig);
      setState({...state, queryData: data as T[], apiError: "", scrollToIndex: 0});
    } catch (exception) {
      let responseMessage: string = "";

      if (exception.response) {
        const { data: { message } } = exception.response as AsyncActionErrorResponse;
        responseMessage = (Array.isArray(message)) ? message.join("; ") : message;
      }

      const errorMessage: string = responseMessage || exception.message;
      setState({...state, apiError: "Error: " + errorMessage});
    }
  };

  const noRowsRenderer = () => (
    <Box className={classes.emptyMsg}>
      <Text translation={noRowsTranslation} />
    </Box>
  );

  const rowGetter = ({ index }: Index): T => {
    return state.queryData[index];
  };

  const rowClassName = ({ index }: Index) => {
    return (index % 2 === 0) ?
    `${classes.row} ${classes.rowEven}` :
    `${classes.row} ${classes.rowOdd}`;
  };

  const measurerCache = new CellMeasurerCache({
    fixedWidth: true,
    fixedHeight: !cellMeasure,
    minHeight: 50,
  });

  const tableRenderer = ({ height, width }: Size) => {
    return (
      <Table
        width={width}
        height={height}
        headerHeight={headerHeight}
        rowHeight={measurerCache.rowHeight}
        deferredMeasurementCache={measurerCache}
        rowCount={state.queryData.length}
        className={classes.table}
        rowClassName={rowClassName}
        headerClassName={classes.header}
        rowGetter={rowGetter}
        noRowsRenderer={noRowsRenderer}
        onRowClick={onSelect && (({rowData}) => onSelect({rowData})())}
        scrollToIndex={state.scrollToIndex}
      >
        {columns.map((item) => TableColumn<T>(item, { measurerCache, searchable, queryGetter }))}
      </Table>
    );
  };

  const bodyRenderer = () => {
    return (
      <AutoSizer>
        {tableRenderer}
      </AutoSizer>
    );
  };

  return (
    <Box className={classes.root}>
      <div style={{color: "red"}}>{state.apiError}</div>
      {bodyRenderer()}
    </Box>
  );
};
