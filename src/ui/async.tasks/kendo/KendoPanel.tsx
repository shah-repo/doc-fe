import { Box, Grid, Typography } from "@material-ui/core";
import { DataResult, process, State } from "@progress/kendo-data-query";
import {
  setExpandedState,
  setGroupIds,
} from "@progress/kendo-react-data-tools";
import {
  Grid as KendoGrid,
  GridColumn,
  GridColumnMenuGroup,
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridDataStateChangeEvent,
  GridExpandChangeEvent,
  GridNoRecords,
  GridToolbar,
} from "@progress/kendo-react-grid";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { find, isEmpty, map, sortBy } from "lodash";
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import apiClient from "../../../state/apiClient";
import { GetAsyncTaskResponse } from "../../../state/ducks/async.tasks/types";
import { authActions } from "../../../state/ducks/auth";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import CellRender from "../../components/common/kendo.column.templates/CellRender";
import { CommonCell } from "../../components/common/kendo.column.templates/CommonCell";
import ColumnHeader from "../../components/common/kendo/ColumnHeader";
import { hideColumnTitleOnResize } from "../../components/common/kendo/helpers";
import Loader from "../../components/common/kendo/Loader";
import NoDataFound from "../../components/common/kendo/NoDataFound";
import {
  KendoColumn,
  KendoPanelProps,
} from "../../components/common/kendo/types";
import KendoGlobalization from "../../components/KendoGlobalization";
import ClearFilters from "../../components/table/ClearFilters";
import Text from "../../components/Text";
import useDidMount from "../../hooks/useDidMount";
import { DurationCell } from "./cell.template/DurationCell";
import { NextTaskDropDown } from "./cell.template/NextTaskDropDown";
import { StatusDropDown } from "./cell.template/StatusDropDown";
import { TaskTypeDropDown } from "./cell.template/TaskTypeDropDown";
import KendoGridStyles from "./styles";

let call: CancelTokenSource;

export function KendoPanel<T>({
  gridConfiguration = { columns: [], pagerSettings: {}, groupableFields: [] },
  tableName,
  gridData,
  tableCriteria,
  queryUrl = "",
}: KendoPanelProps<Partial<GetAsyncTaskResponse>>) {
  const intl = useIntl();
  const getTranslatedText = (key: string) =>
    key ? intl.formatMessage({ id: key }) : "";
  const didMount = useDidMount();
  const dispatch = useDispatch();
  const classes = KendoGridStyles();
  const { columnConfig, kendoConfig } = tableCriteria;
  if (columnConfig && JSON.parse(columnConfig).length) {
    gridConfiguration.columns = JSON.parse(columnConfig);
  }
  const [columnDefinitions, setColumnDefinitions] = useState<KendoColumn[]>(
    gridConfiguration.columns
  );
  const updateDataColumnsState = (dataColumns: KendoColumn[]) => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          columnConfig: JSON.stringify(dataColumns),
        },
        tableName
      )
    );
  };
  const processWithGroups = (
    data: Partial<GetAsyncTaskResponse>[],
    dataState: State
  ) => {
    const newDataState = process(data, dataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };

  let initialDataState: State;

  if (kendoConfig) {
    initialDataState = JSON.parse(kendoConfig);
  } else {
    initialDataState = {
      filter: {
        logic: "and",
        filters: [],
      },
      skip: 0,
      take: 25,
      group: [],
      sort: [],
    };
  }

  const setSearchStatus = (reset: boolean) => {
    dataState.filter = {
      logic: "and",
      filters: [],
    };
    if (reset) {
      dataState.group = [];
      dataState.sort = [];
      dataState.skip = 0;
      dataState.take = 25;
    }
    setDataState(dataState);
    const newDataState = processWithGroups(gridData, dataState);
    setResultState(newDataState);
    tableCriteria.kendoConfig = JSON.stringify(dataState);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          columnConfig: JSON.stringify(gridConfiguration.columns),
          queryDict: {},
        },
        tableName
      )
    );
  };
  const setKendoFilterStatus = (kendoConfig: string): void => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          kendoConfig,
          queryDict: {},
        },
        tableName
      )
    );
  };
  const [isLoading, setIsLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  const [fireAPI, setFireAPI] = useState(true);
  const [dataState, setDataState] = useState<State>(initialDataState);
  const [collapsedState, setCollapsedState] = useState<string[]>([]);
  const [resultState, setResultState] = useState<DataResult>(
    processWithGroups(gridData, initialDataState)
  );
  useEffect(() => {
    if (didMount) {
      if (isEmpty(tableCriteria.queryDict)) {
        if (fireAPI) {
          queryApi();
        }
      } else if (fireAPI) {
        queryApi();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableCriteria.kendoConfig, didMount, tableCriteria.forceUpdate]);

  const queryApi = () => {
    call?.cancel();
    call = axios.CancelToken.source();
    const requestConfig: AxiosRequestConfig = {
      method: "get",
      url: queryUrl,
      params: {},
      paramsSerializer: (params) => qs.stringify(params),
      headers: {},
      cancelToken: call.token,
    };
    requestConfig.headers.Authorization = `bearer ${
      store.getState().auth.user.employeeId
    }:${store.getState().auth.user.sessionId}`;
    setIsLoading(true);
    setNoDataMessage(<span />);
    dispatch(tableSearchActions.setData([], tableName));
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          apiError: "",
          scrollToIndex: 0,
          forceUpdate: false,
          kendoConfig: JSON.stringify(initialDataState),
          columnConfig: JSON.stringify(columnDefinitions),
        },
        tableName
      )
    );
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        data = data.map((el) => ({
          ...el,
          nextTaskTypes: el.nextTaskTypes
            ?.sort()
            .join(", "),
          status: el.status,
        }));
        const newDataState = processWithGroups(data, initialDataState);
        setDataState(initialDataState);
        setResultState(newDataState);
        if (newDataState.total === 0) {
          setNoDataMessage(<NoDataFound />);
        }
        dispatch(tableSearchActions.setData(data, tableName));
        setIsLoading(false);
        setFireAPI(false);
      })
      .catch((exception) => {
        if (axios.isCancel(exception)) {
          return;
        }
        setIsLoading(false);
        setFireAPI(false);
        let responseMessage = "";
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
        const errorMessage: string = responseMessage || exception.message;
        dispatch(
          tableSearchActions.setSearchCriteria(
            {
              queryDict: {},
              apiError: "Error: " + errorMessage,
              forceUpdate: false,
              kendoConfig: JSON.stringify(initialDataState),
              columnConfig: JSON.stringify(columnDefinitions),
            },
            tableName
          )
        );
      });
  };

  const result = setExpandedState({
    data: resultState.data,
    collapsedIds: collapsedState,
  });
  const onDataStateChange = useCallback(
    ({ dataState }: GridDataStateChangeEvent) => {
      const newDataState = processWithGroups(gridData, dataState);
      tableCriteria.kendoConfig = JSON.stringify(dataState);
      setDataState(dataState);
      setResultState(newDataState);
      setKendoFilterStatus(JSON.stringify(dataState));
      if (!newDataState.total) {
        setNoDataMessage(<NoDataFound />);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridData]
  );
  const onExpandChange = useCallback(
    ({ value, dataItem }: GridExpandChangeEvent) => {
      const item = dataItem;
      if (item.groupId) {
        const newCollapsedIds = !value
          ? [...collapsedState, item.groupId]
          : collapsedState.filter((groupId) => groupId !== item.groupId);
        setCollapsedState(newCollapsedIds);
      }
    },
    [collapsedState]
  );
  const clearFilter = () => setSearchStatus(false);

  const filterCellMapping = {
    status: StatusDropDown,
    taskType: TaskTypeDropDown,
    nextTaskTypes: NextTaskDropDown,
  };

  const fieldToCellMapping = {
    "createdAt": DurationCell,
    "taskType": CommonCell,
    "employee.user.name": CommonCell,
    "employee.user.email": CommonCell,
    "status": CommonCell,
    "duration": DurationCell,
    "nextTaskTypes": CommonCell,
  };

  const columnRenderer = () =>
    sortBy(columnDefinitions, ["orderIndex"]).map((column, idx) => (
      <GridColumn
        key={idx}
        {...column}
        title={getTranslatedText(column.title)}
        minResizableWidth={100}
        cell={
          fieldToCellMapping[column.field]
            ? fieldToCellMapping[column.field]
            : undefined
        }
        filterCell={
          filterCellMapping[column.field]
            ? filterCellMapping[column.field]
            : undefined
        }
        headerCell={
          column.title ? (props) => <ColumnHeader {...props} /> : undefined
        }
        columnMenu={
          column.showColumnMenu
            ? (props) => <GridColumnMenuGroup {...props} />
            : undefined
        }
      />
    ));

  const columnResize = ({ columns, end }: GridColumnResizeEvent) => {
    if (!end) {
      return false;
    }
    let dataColumns: KendoColumn[] = gridConfiguration.columns;
    dataColumns = map(dataColumns, (column: KendoColumn) => {
      const columnObject = find(columns, { field: column.field });
      column.width = columnObject?.width;
      return column;
    });
    hideColumnTitleOnResize();
    setColumnDefinitions(dataColumns);
    updateDataColumnsState(dataColumns);
  };

  const columnReorder = ({ columns }: GridColumnReorderEvent) => {
    let dataColumns: KendoColumn[] = gridConfiguration.columns;
    dataColumns = map(dataColumns, (column: KendoColumn) => {
      const columnObject = find(columns, { field: column.field });
      column.orderIndex = columnObject?.orderIndex;
      return column;
    });
    setColumnDefinitions(dataColumns);
    updateDataColumnsState(dataColumns);
  };

  const tableRenderer = () => (
    <>
      <KendoGlobalization>
        <KendoGrid
          className={`${classes.kGrid} no-row-pointer`}
          data={result}
          total={resultState.total}
          pageable={gridConfiguration.pagerSettings}
          sortable={true}
          filterable={true}
          reorderable={true}
          resizable={true}
          groupable={true}
          cellRender={CellRender}
          onDataStateChange={onDataStateChange}
          {...dataState}
          onExpandChange={onExpandChange}
          expandField="expanded"
          onColumnResize={columnResize}
          onColumnReorder={columnReorder}
        >
          <GridToolbar>
            <Grid
              container
              spacing={1}
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <ClearFilters {...{ clearFilter }} />
              </Grid>
            </Grid>
          </GridToolbar>
          {columnRenderer()}
          <GridNoRecords>{noDataMessage}</GridNoRecords>
        </KendoGrid>
      </KendoGlobalization>
      {isLoading && <Loader />}
    </>
  );
  return (
    <>
      <Grid container justify="space-between">
        <Grid item>
          <Typography className={classes.title}><Text translation="async.task.table.history" /></Typography>
        </Grid>
      </Grid>
      <Box className={classes.root}>
        <div className={classes.errorClass}>{tableCriteria.apiError}</div>
        {tableRenderer()}
      </Box>
    </>
  );
}
