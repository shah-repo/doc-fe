import { Box, Typography } from "@material-ui/core";
import { AxiosRequestConfig } from "axios";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import {
  AutoSizer,
  CellMeasurerCache,
  Index,
  Size,
  Table,
} from "react-virtualized";
import { useDebounce } from "use-debounce";
import apiClient from "../../../state/apiClient";
import refreshTokenOperation from "../../../state/middlewares/api/refreshToken";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import Text from "../../components/Text";
import useDidMount from "../../hooks/useDidMount";
import { TableColumn } from "./column/base";
import { styles } from "./styles";
import { TablePanelProps, TablePanelStateProps, TableStyleProps } from "./types";

type Props<T> = TablePanelProps<T>;

export function TablePanel<T extends any>({
  tableData,
  columns,
  noRowsTranslation = "table.no.results.found",
  cellMeasure = false,
  onSelect,
  searchable = true,
  queryUrl = "",
  customQuerySet,
  customDataSet,
}: Props<T>) {

  const didMount = useDidMount();
  const queryDelay = 300;
  let lastQueryValue: string = "";
  const headerHeight = (searchable) ? 117 : 50;
  const styleProps: TableStyleProps = { isSelectable: (onSelect !== undefined) };
  const classes = styles(styleProps);

  const [state, setState] = useState<TablePanelStateProps<T>>({
    queryData: tableData,
    queryDict: {},
    apiError: "",
    scrollToIndex: 0,
  });
  const [debouncedQuery] = useDebounce(state.queryDict, queryDelay);
  useEffect(() => {
    if (didMount) {
      queryApi();
    }
  }, [debouncedQuery]);

  const queryGetter = (key: string, value: string) => {
    if (!queryUrl) { return; }
    lastQueryValue = value;

    if (lastQueryValue !== value) { return; }
    let dict = { ...state.queryDict };
    (value === "") ? delete dict[key] : dict[key] = value;

    if (customQuerySet) {
      dict = customQuerySet(dict);
    }

    setState({...state, queryDict: dict});
  };

  const queryApi = async () => {
    try {
      const requestConfig: AxiosRequestConfig = {
        method: "get",
        url: queryUrl,
        params: state.queryDict,
        paramsSerializer: (params) => qs.stringify(params),
        headers: {},
      };

      await refreshTokenOperation(store.dispatch, store.getState());
      requestConfig.headers.Authorization = store.getState().auth.tokens.id.value;

      let { data } = await apiClient.request(requestConfig);
      if (customDataSet) {
        data = customDataSet(data);
      }
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

  const rowGetter = ({ index }: Index): T => state.queryData[index] as T;

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
        rowClassName={classes.row}
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

  const recordsCountRenderer = () => (
    <Typography variant="h6">
      <Text translation="common.records.found"/>
      :&nbsp;
      <span style={{fontWeight: "bold"}}>{state.queryData.length}</span>
    </Typography>
  );

  return (
    <Box className={classes.root}>
      {recordsCountRenderer()}
      <div style={{color: "red"}}>{state.apiError}</div>
      {bodyRenderer()}
    </Box>
  );
}
