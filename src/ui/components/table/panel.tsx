/* eslint-disable react-hooks/exhaustive-deps */
import { Box, CircularProgress } from "@material-ui/core";
import axios, { AxiosRequestConfig } from "axios";
import _ from "lodash";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutoSizer, CellMeasurerCache, Index, Size, SortDirection, Table } from "react-virtualized";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import apiClient from "../../../state/apiClient";
import { authActions } from "../../../state/ducks/auth";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import Text from "../../components/Text";
import useDidMount from "../../hooks/useDidMount";
import { TableColumn } from "./column/base";
import { styles } from "./styles";
import { TablePanelProps, TableSortProps, TableStyleProps } from "./types";

type Props<T> = TablePanelProps<T>;

let call;

export function TablePanel<T extends any>({
  columns,
  noRowsTranslation = "table.no.results.found",
  cellMeasure = false,
  onSelect,
  searchable = true,
  queryUrl = "",
  customQuerySet,
  customDataSet,
  sortBy,
  tableName,
  providedData,
  rootCustomStyle,
}: Props<T>) {
  const didMount = useDidMount();
  let lastQueryValue = "";
  const headerHeight = searchable ? 117 : 50;
  const styleProps: TableStyleProps = {
    isSelectable: onSelect !== undefined,
  };

  const classes = styles(styleProps);
  const sortDirection = SortDirection.DESC;

  const [isLoading, setIsLoading] = useState(false);
  const tableCriteria = useSelector(getTableCriteria(tableName));
  const tableData = useSelector(getTableData(tableName));
  const dispatch = useDispatch();
  const queryData = providedData || tableData;

  const processData = (
    data: T[],
    sortBy = "",
    sortDirection = "DESC",
  ) => {
    let sortedData = _.sortBy(
      data,
      sortBy === "docId" ? `document.${sortBy}` : sortBy,
    );
    sortedData = sortDirection === "DESC" ? sortedData.reverse() : sortedData;

    return sortedData;
  };

  useEffect(() => {
    if (didMount) {
      queryApi();
    }
  }, [tableCriteria.queryDict]);
  useEffect(() => {
    queryApi();
  }, []);
  useEffect(() => {
    if (tableCriteria.forceUpdate) {
      queryApi();
    }
  }, [tableCriteria.forceUpdate]);

  const debounced = _.debounce((f) => {
    f();
  }, 300);

  const queryGetter = (key: string, value: string) => {
    if (!queryUrl) {
      return;
    }
    lastQueryValue = value;

    if (lastQueryValue !== value) {
      return;
    }

    if (call) {
      call.cancel();
    }

    let dict = { ...tableCriteria.queryDict };
    value === "" ? delete dict[key] : (dict[key] = value);

    if (customQuerySet) {
      dict = customQuerySet(dict);
    }

    debounced(() => {
      dispatch(
        tableSearchActions.setSearchCriteria(
          { ...tableCriteria, queryDict: dict, sortDirection },
          tableName,
        ),
      );
    });
  };

  const formatParams = () => {
    const params: any = {};
    Object.entries(tableCriteria.queryDict)
      .forEach(([key, value]) => {
        if (key.startsWith("dynamicParams")) {
          _.set(params, key, value);
        } else {
          params[key] = value;
        }
      });
    params.dynamicParams = JSON.stringify(params.dynamicParams);
    return params;
  };

  const queryApi = async () => {
    try {
      if (call) {
        call.cancel();
      }

      call = axios.CancelToken.source();

      const requestConfig: AxiosRequestConfig = {
        method: "get",
        url: queryUrl,
        params: formatParams(),
        paramsSerializer: (params) => qs.stringify(params),
        headers: {},
        cancelToken: call.token,
      };

      requestConfig.headers.Authorization = `bearer ${
        store.getState().auth.user.employeeId
        }:${store.getState().auth.user.sessionId}`;

      setIsLoading(true);
      dispatch(
        tableSearchActions.setData(
          [],
          tableName,
        ),
      );

      let { data } = await apiClient.request(requestConfig);
      if (customDataSet) {
        data = customDataSet(data);
      }

      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            apiError: "",
            scrollToIndex: 0,
            forceUpdate: false,
          },
          tableName,
        ),
      );
      dispatch(
        tableSearchActions.setData(
          data,
          tableName,
        ),
      );
      setIsLoading(false);
    } catch (exception) {
      setIsLoading(false);
      if (axios.isCancel(exception)) {
        return;
      }
      let responseMessage = "";
      const isUnauthorizedRequest = exception.response.status === 401;

      if (isUnauthorizedRequest) {
        dispatch(authActions.logoutUser());
        return;
      }

      if (exception.response) {
        const {
          data: { message },
        } = exception.response as AsyncActionErrorResponse;
        responseMessage = Array.isArray(message) ? message.join("; ") : message;
      }

      const errorMessage: string = responseMessage || exception.message;

      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            apiError: "Error: " + errorMessage,
            forceUpdate: false,
          },
          tableName,
        ),
      );
    }
  };

  const noRowsRenderer = () => isLoading ?
    <Box textAlign="center" marginTop="50px">
      <CircularProgress />
    </Box>
    :
    <Box className={classes.emptyMsg} data-cy={"no.results.found"}>
      <Text translation={noRowsTranslation} />
    </Box>;

  const rowGetter = ({ index }: Index): T => queryData[index] as T;

  const measurerCache = new CellMeasurerCache({
    fixedWidth: true,
    fixedHeight: !cellMeasure,
    minHeight: 50,
  });

  const tableRenderer = ({ height, width }: Size) => (
    <Table
      width={width}
      height={height}
      headerHeight={headerHeight}
      rowHeight={measurerCache.rowHeight}
      deferredMeasurementCache={measurerCache}
      rowCount={queryData.length}
      className={classes.table}
      rowClassName={classes.row}
      headerClassName={classes.header}
      rowGetter={rowGetter}
      sortBy={sortBy}
      sort={sort}
      sortDirection={tableCriteria.sortDirection}
      noRowsRenderer={noRowsRenderer}
      onRowClick={onSelect && (({ rowData }) => onSelect({ rowData })())}
      scrollToIndex={tableCriteria.scrollToIndex}
    >
      {columns.map((item) =>
        TableColumn<T>(item, { measurerCache, searchable, queryGetter }),
      )}
    </Table>
  );

  const sort = ({ sortBy, sortDirection }: TableSortProps<T>) => {
    const sortedTableData = processData(
      tableData,
      sortBy,
      sortDirection,
    );

    dispatch(
      tableSearchActions.setTableSort(
        {
          ...tableCriteria,
          sortDirection,
        },
        tableName,
      ),
    );
    dispatch(
      tableSearchActions.setData(
        sortedTableData,
        tableName,
      ),
    );
  };

  const bodyRenderer = () => <AutoSizer>{tableRenderer}</AutoSizer>;

  return (
    <Box className={rootCustomStyle ? rootCustomStyle : classes.root}>
      <div style={{ color: "red" }}>{tableCriteria.apiError}</div>
      {bodyRenderer()}
    </Box>
  );
}
