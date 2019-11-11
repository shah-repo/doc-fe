import { Box } from "@material-ui/core";
import { AxiosRequestConfig } from "axios";
import _ from "lodash";
import qs from "query-string";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AutoSizer,
  CellMeasurerCache,
  Index,
  Size,
  SortDirection,
  SortDirectionType,
  Table,
} from "react-virtualized";
import { useDebounce } from "use-debounce";
import apiClient from "../../../state/apiClient";
import {
  tableSearchActions,
  tableSearchSelectors,
} from "../../../state/ducks/tableSearch";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { ApplicationState } from "../../../state/reducers";
import { store } from "../../../state/store";
import Text from "../../components/Text";
import useDidMount from "../../hooks/useDidMount";
import { TableColumn } from "./column/base";
import { styles } from "./styles";
import { TablePanelProps, TableSortProps, TableStyleProps } from "./types";

type Props<T> = TablePanelProps<T>;

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
}: Props<T>) {
  const didMount = useDidMount();
  const queryDelay = 300;
  let lastQueryValue: string = "";
  const headerHeight = searchable ? 117 : 50;
  const styleProps: TableStyleProps = {
    isSelectable: onSelect !== undefined,
  };

  const classes = styles(styleProps);
  const sortDirection = SortDirection.DESC;

  const tableState = useSelector((reduxState: ApplicationState) =>
    tableSearchSelectors.getTableState(reduxState, tableName),
  );
  const [debouncedQuery] = useDebounce(tableState.queryDict, queryDelay);
  const dispatch = useDispatch();
  const queryData = providedData || tableState.queryData;

  const processData = (
    data: T[],
    sortBy: string,
    sortDirection: SortDirectionType,
  ) => {
    let sortedData = _.sortBy(data, `document.${sortBy}`);
    sortedData = sortDirection === "DESC" ? sortedData.reverse() : sortedData;

    return sortedData;
  };

  useEffect(() => {
    if (didMount) {
      queryApi();
    }
  }, [debouncedQuery]);
  useEffect(() => {
    queryApi();
  }, []);

  const queryGetter = (key: string, value: string) => {
    if (!queryUrl) {
      return;
    }
    lastQueryValue = value;

    if (lastQueryValue !== value) {
      return;
    }
    let dict = { ...tableState.queryDict };
    value === "" ? delete dict[key] : (dict[key] = value);

    if (customQuerySet) {
      dict = customQuerySet(dict);
    }

    dispatch(
      tableSearchActions.setSearchCriteria(
        { ...tableState, queryDict: dict, sortDirection },
        tableName,
      ),
    );
  };

  const queryApi = async () => {
    try {
      const requestConfig: AxiosRequestConfig = {
        method: "get",
        url: queryUrl,
        params: tableState.queryDict,
        paramsSerializer: (params) => qs.stringify(params),
        headers: {},
      };

      requestConfig.headers.Authorization = `bearer ${
        store.getState().auth.user.employeeId
      }:${store.getState().auth.user.sessionId}`;

      let { data } = await apiClient.request(requestConfig);
      if (customDataSet) {
        data = customDataSet(data);
      }

      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableState,
            queryData: data as T[],
            apiError: "",
            scrollToIndex: 0,
          },
          tableName,
        ),
      );
    } catch (exception) {
      let responseMessage: string = "";

      if (exception.response) {
        const {
          data: { message },
        } = exception.response as AsyncActionErrorResponse;
        responseMessage = Array.isArray(message) ? message.join("; ") : message;
      }

      const errorMessage: string = responseMessage || exception.message;

      dispatch(
        tableSearchActions.setSearchCriteria(
          { ...tableState, apiError: "Error: " + errorMessage },
          tableName,
        ),
      );
    }
  };

  const noRowsRenderer = () => (
    <Box className={classes.emptyMsg}>
      <Text translation={noRowsTranslation} />
    </Box>
  );

  const rowGetter = ({ index }: Index): T => queryData[index] as T;

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
        rowCount={queryData.length}
        className={classes.table}
        rowClassName={classes.row}
        headerClassName={classes.header}
        rowGetter={rowGetter}
        sortBy={sortBy}
        sort={sort}
        sortDirection={tableState.sortDirection}
        noRowsRenderer={noRowsRenderer}
        onRowClick={onSelect && (({ rowData }) => onSelect({ rowData })())}
        scrollToIndex={tableState.scrollToIndex}
      >
        {columns.map((item) =>
          TableColumn<T>(item, { measurerCache, searchable, queryGetter }),
        )}
      </Table>
    );
  };

  const sort = ({ sortBy, sortDirection }: TableSortProps<T>) => {
    const sortedTableData = processData(
      tableState.queryData,
      sortBy!,
      sortDirection!,
    );

    dispatch(
      tableSearchActions.setTableSort(
        {
          ...tableState,
          queryData: sortedTableData as T[],
          apiError: "",
          scrollToIndex: 0,
          sortDirection,
        },
        tableName,
      ),
    );
  };

  const bodyRenderer = () => {
    return <AutoSizer>{tableRenderer}</AutoSizer>;
  };

  return (
    <Box className={classes.root}>
      <div style={{ color: "red" }}>{tableState.apiError}</div>
      {bodyRenderer()}
    </Box>
  );
}
