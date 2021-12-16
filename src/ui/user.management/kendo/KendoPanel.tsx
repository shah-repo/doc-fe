/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box, Grid, Typography,
} from "@material-ui/core";
import { DataResult, process, State } from "@progress/kendo-data-query";
import {
  setExpandedState,
  setGroupIds,
} from "@progress/kendo-react-data-tools";
import {
  Grid as KendoGrid,
  GridCellProps,
  GridColumn,
  GridDataStateChangeEvent,
  GridExpandChangeEvent,
  GridNoRecords,
  GridToolbar,
} from "@progress/kendo-react-grid";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { find, isEmpty } from "lodash";
import { denormalize } from "normalizr";
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as generateUuid from "uuid/v4";
import {
  getTableCriteria,
  getTableData,
} from "../../../common/utils/selectors";
import apiClient from "../../../state/apiClient";
import { authActions } from "../../../state/ducks/auth";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { userManagementActions, userManagementSelectors } from "../../../state/ducks/userManagement";
import { LoadCompanyGroup } from "../../../state/ducks/userManagement/types";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import KendoGlobalization from "../../components/KendoGlobalization";
import { toastError } from "../../components/notifications";
import ClearFilters from "../../components/table/ClearFilters";
import {
  TablePanelStateProps,
  TableStyleProps,
} from "../../components/table/types";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDidMount from "../../hooks/useDidMount";
import AddEmployeeContainer from "../add.employee/container";
import EnableDropboxButton from "../EnableDropboxButton/EnableDropboxButton";
import { CommandCell } from "./cell_template/commandCell";
import { EmailCell } from "./cell_template/emailCell";
import { NameCell } from "./cell_template/nameCell";
import KendoGridStyles from "./kendogrid.styles";
import { TablePanelProps, UserManage } from "./types";

type Props<T> = TablePanelProps<T>;

let call: CancelTokenSource;

export function KendoPanel<T extends any>({
  columns,
  queryUrl,
  tableName,
  onSelect,
  data,
  normalizrSchema,
  hasDropboxPermission,
  dropboxAsync,
  enableDropboxAction,
  isCompanyDropboxEnabled,
}: Props<T>) {
  const editField = "inEdit";
  const didMount = useDidMount();
  const dispatch = useDispatch();
  const styleProps: TableStyleProps = {
    isSelectable: onSelect !== undefined,
  };
  const classes = KendoGridStyles(styleProps);
  const tableCriteria = useSelector(getTableCriteria(tableName));
  const tableData = useSelector(getTableData(tableName));
  const kendoConfigColumn = tableCriteria.columnConfig;
  const gridConfiguration = columns ? columns : kendoConfigColumn;
  const processWithGroups = (data: any[], dataState: State) => {
    const newDataState = process(data, dataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };
  const kendoConfigFromState = tableCriteria.kendoConfig;
  const initialColumnsConfig = tableCriteria.columnConfig
    ? JSON.parse(tableCriteria.columnConfig)
    : [];
  gridConfiguration.columns.forEach((column) => {
    const foundObj = initialColumnsConfig.find(
      (initialColumn) => initialColumn.field === column.field
    );
    // further update all column fields here
    if (foundObj) {
      column.show = foundObj.show;
    }
    if (!column.field && !column.title) {
      // eslint-disable-next-line react/display-name
      column.cell = (props: GridCellProps) => (
        <CommandCell {...props} edit={edit} add={add} cancel={cancel} editField={editField} />
      );
    }

    if (column.field === "user.name") {
      // eslint-disable-next-line react/display-name
      column.cell = (props: GridCellProps) => (
        <NameCell {...props} />
      );
    }

    if (column.field === "user.email") {
      // eslint-disable-next-line react/display-name
      column.cell = (props: GridCellProps) => (
        <EmailCell {...props} />
      );
    }
  });
  const edit = (dataItem: any) => {
    onSelect && onSelect({ dataItem })();
  };

  const add = (dataItem: UserManage) => {
    dataItem.inEdit = true;
    console.log("Added Item", dataItem);
    const payload = {
      user: {
        id: dataItem.id,
        name: dataItem.name,
        email: dataItem.email,
      },
      groups: dataItem.groups,
    };
    console.log("payload", payload);
    handleCreate(payload);
  };
  const addEmployeeAction = useActionCreator(userManagementActions.addEmployee);

  const async = useAsync({
    onSuccess: () => {
      queryApi();
    },
    onError: (error) => {
      toastError(error as string);
    },
  });

  const handleCreate = (values) => {
    async.start(addEmployeeAction, values, async);
  };


  const cancel = (dataItem: UserManage) => {
    tableData.splice(0, 1);
    const newDataState = processWithGroups(tableData, dataState);
    setResultState(newDataState);
  };

  const initialKendoConfig: State = kendoConfigFromState
    ? JSON.parse(kendoConfigFromState)
    : {
      skip: 0,
      take: 25,
      group: [],
    };
  const setSearchStatus = (state?: LoadCompanyGroup) => {
    dataState.filter = {
      logic: "and",
      filters: state ? [{ field: "groups", operator: "eq", value: "" }] : [],
    };
    setDataState(dataState);
    setResultState({
      data: [],
      total: 0,
    });
    tableCriteria.kendoConfig = JSON.stringify(dataState);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {},
        },
        tableName
      )
    );
  };
  const setKendoFilterStatus = (
    kendoConfig: string,
    tableCriteria: Partial<TablePanelStateProps>
  ): void => {
    const kendoConfigObject = JSON.parse(kendoConfig);
    const stateFilerObject = find(kendoConfigObject.filter?.filters, {
      field: "groups",
    });
    if (stateFilerObject) {
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
          },
          tableName
        )
      );
    } else {
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            queryDict: {},
          },
          tableName
        )
      );
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  const [fireAPI, setFireAPI] = useState(true);
  const [dataState, setDataState] = useState<State>(initialKendoConfig); // Kendo Grid Data State
  const [collapsedState, setCollapsedState] = useState<string[]>([]);
  const [resultState, setResultState] = useState<DataResult>(
    processWithGroups(tableData, initialKendoConfig)
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
    if (normalizrSchema) {
      requestConfig.headers["x-enlil-normalizr-response"] = true;
    }
    setIsLoading(true);
    setNoDataMessage(<span />);
    dispatch(tableSearchActions.setData([], tableName));
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          apiError: "",
          scrollToIndex: 0,
          forceUpdate: false,
          kendoConfig: JSON.stringify(initialKendoConfig),
          columnConfig: JSON.stringify(initialColumnsConfig),
        },
        tableName
      )
    );
    apiClient
      .request(requestConfig)
      .then((resp) => {
        if (normalizrSchema) {
          const { entities, result } = resp.data;
          resp.data = denormalize(result, normalizrSchema, entities);
        }
        return resp;
      })
      .then(({ data }) => {
        data = data.map((el) => ({
          ...el,
          groupsOrg: el.groups,
          groups: el.groups.map((e) => e.name).join(", "),
        }));
        const newDataState = processWithGroups(data, initialKendoConfig);
        setDataState(initialKendoConfig);
        setResultState(newDataState);
        if (data.length === 0) {
          setNoDataMessage(
            <Typography>
              <Text translation="table.no.results.found"></Text>
            </Typography>
          );
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
              kendoConfig: JSON.stringify(initialKendoConfig),
              columnConfig: JSON.stringify(initialColumnsConfig),
            },
            tableName
          )
        );
      });
  };
  const loadingPanel = isLoading && (
    <div className={`k-loading-mask`}>
      <div className="k-loading-image"></div>
      <div className="k-loading-color"></div>
    </div>
  );
  const result = setExpandedState({
    data: processWithGroups(tableData, initialKendoConfig).data,
    collapsedIds: collapsedState,
  });
  const onDataStateChange = useCallback(
    (event: GridDataStateChangeEvent) => {
      const newDataState = processWithGroups(tableData, event.dataState);
      tableCriteria.kendoConfig = JSON.stringify(event.dataState);
      setDataState(event.dataState);
      setResultState(newDataState);
      setKendoFilterStatus(JSON.stringify(event.dataState), tableCriteria);
    },
    [tableData]
  );
  const onExpandChange = useCallback(
    (event: GridExpandChangeEvent) => {
      const item = event.dataItem;
      if (item.groupId) {
        const newCollapsedIds = !event.value
          ? [...collapsedState, item.groupId]
          : collapsedState.filter((groupId) => groupId !== item.groupId);
        setCollapsedState(newCollapsedIds);
      }
    },
    [collapsedState]
  );
  const clearFilter = () => setSearchStatus();
  const columnRenderer = (column: any, index: React.Key | undefined) => (
    <GridColumn
      key={index}
      field={column.field}
      title={column.title}
      cell={column.cell}
      filter={column.filter}
      groupable={column.groupable}
      filterCell={column.filterCell}
      filterable={column.filterable}
    />
  );

  // const columnResize = (event) => {
  //   // eslint-disable-next-line no-console
  //   console.log(event.columns);
  //   dispatch(
  //     tableSearchActions.setSearchCriteria(
  //       {
  //         ...tableCriteria,
  //         columnConfig: JSON.stringify(event.columns),
  //       },
  //       tableName
  //     )
  //   );
  // };

  // const columnReorder = (event) => {
  //   dispatch(
  //     tableSearchActions.setSearchCriteria(
  //       {
  //         ...tableCriteria,
  //         columnConfig: JSON.stringify(event.columns),
  //       },
  //       tableName
  //     )
  //   );
  // };

  const defaultGroups = useSelector(userManagementSelectors.getDefaultGroups);

  const addNew = () => {
    const newDataItem: UserManage = {
      id: generateUuid(),
      inEdit: true,
      active: true,
      groups: defaultGroups.map((el) => ({ id: el.value })) as [],
    };
    tableData.unshift(newDataItem);
    setResultState(processWithGroups(tableData, dataState));
  };
  const tableRenderer = () => (
    <>
      <KendoGlobalization>
        <KendoGrid
          key={tableName}
          className={classes.kGrid}
          data={result}
          total={resultState.total > 0 ? resultState.total : tableData.length}
          pageable={gridConfiguration.pagerSettings}
          sortable={true}
          filterable={true}
          reorderable={true}
          resizable={true}
          groupable={true}
          onDataStateChange={onDataStateChange}
          {...dataState}
          onExpandChange={onExpandChange}
          expandField="expanded"
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
              <Grid item style={{ display: "flex" }}>
                <EnableDropboxButton
                  shouldDisplayButton={hasDropboxPermission}
                  {...{ dropboxAsync, enableDropboxAction }}
                  disabled={Boolean(isCompanyDropboxEnabled)}
                />
                <AddEmployeeContainer  addGroup={addNew} />
              </Grid>
            </Grid>
          </GridToolbar>
          {gridConfiguration.columns.map((column, idx) => {
            if (column.show === true) {
              return columnRenderer(column, idx);
            } else {
              return (
                <>
                  <KendoGrid data={[]}>
                    <GridNoRecords>There is no data available</GridNoRecords>
                    <GridColumn field="id" />
                    <GridColumn field="name" />
                  </KendoGrid>
                </>
              );
            }
          })}
          <GridNoRecords>{noDataMessage}</GridNoRecords>
        </KendoGrid>
      </KendoGlobalization>
      {isLoading && loadingPanel}
    </>
  );
  return (
    <Box className={classes.root}>
      <div style={{ color: "red" }}>{tableCriteria.apiError}</div>
      {tableRenderer()}
    </Box>
  );
}
