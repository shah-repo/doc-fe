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
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridDataStateChangeEvent,
  GridExpandChangeEvent, GridNoRecords, GridToolbar,
} from "@progress/kendo-react-grid";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { find, isEmpty, map, sortBy } from "lodash";
import { denormalize } from "normalizr";
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as generateUuid from "uuid/v4";
import apiClient from "../../../state/apiClient";
import { authActions } from "../../../state/ducks/auth";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { userManagementActions, userManagementSelectors } from "../../../state/ducks/userManagement";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import { ActiveDropdown } from "../../components/common/kendo.column.templates/ActiveDropdown";
import ColumnHeader from "../../components/common/kendo/ColumnHeader";
import Loader from "../../components/common/kendo/Loader";
import { KendoColumn } from "../../components/common/kendo/types";
import KendoGlobalization from "../../components/KendoGlobalization";
import { toastError } from "../../components/notifications";
import ClearFilters from "../../components/table/ClearFilters";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDidMount from "../../hooks/useDidMount";
import AddEmployeeContainer from "../add.employee/container";
import EnableDropboxButton from "../EnableDropboxButton/EnableDropboxButton";
import { BooleanFilterCell } from "./cell.template/BooleanFilterCell";
import { CommandCell } from "./cell.template/CommandCell";
import { EmailCell } from "./cell.template/EmailCell";
import { GroupDropdown } from "./cell.template/GroupDropdown";
import { GroupsCell } from "./cell.template/GroupsCell";
import { NameCell } from "./cell.template/NameCell";
import { SignedCell } from "./cell.template/SignedCell";
import KendoGridStyles from "./styles";
import { UserManage, UserManagementProps } from "./types";

type Props<T> = UserManagementProps<T>  ;

let call: CancelTokenSource;

export function KendoPanel<T extends any>({
  gridConfiguration = { columns: [], pagerSettings: {}, groupableFields: [] },
  tableName,
  gridData,
  tableCriteria,
  queryUrl = "",
  onSelect,
  normalizrSchema,
  hasDropboxPermission,
  dropboxAsync,
  enableDropboxAction,
  isCompanyDropboxEnabled,
}: Props<T>) {

  const editField = "inEdit";
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
  const processWithGroups = (data: T[], dataState: State) => {
    const newDataState = process(data, dataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };

  const edit = (dataItem) => {
    onSelect && onSelect({ dataItem })();
  };

  const add = (dataItem: UserManage) => {
    dataItem.inEdit = true;
    const payload = {
      user: {
        id: dataItem.id,
        name: dataItem.name,
        email: dataItem.email,
      },
      groups: dataItem.groups,
    };
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

  const handleCreate = (values: UserManage) => {
    async.start(addEmployeeAction, values, async);
  };


  const cancel = () => {
    gridData.splice(0, 1);
    const newDataState = processWithGroups(gridData, dataState);
    setResultState(newDataState);
  };

  let initialDataState: State;

  if (kendoConfig) {
    initialDataState = JSON.parse(kendoConfig);
  } else  {
    initialDataState = {
      filter:
        {
          logic: "and",
          filters: [{ field: "active", operator: "eq", value: true }],
        },
      skip: 0,
      take: 25,
      group: [],
      sort: [],
    };
  }

  const setSearchStatus = () => {
    dataState.filter = {
      logic: "and",
      filters: [],
    };
    dataState.sort = [];
    dataState.group = [];
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
  const setKendoFilterStatus = (
    kendoConfig: string,
  ): void => {
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
  const [dataState, setDataState] = useState<State>(initialDataState); // Kendo Grid Data State
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
          kendoConfig: JSON.stringify(initialDataState),
          columnConfig: JSON.stringify(columnDefinitions),
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
          groups: el.groups.map((e) => e.name.trimLeft().trimEnd()).sort().join(", "),
          status: el.user.confirmed ? "Signed up" : "Resend signup email",
        }));
        const newDataState = processWithGroups(data, initialDataState);
        setDataState(initialDataState);
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
    (event: GridDataStateChangeEvent) => {
      const newDataState = processWithGroups(gridData, event.dataState);
      tableCriteria.kendoConfig = JSON.stringify(event.dataState);
      setDataState(event.dataState);
      setResultState(newDataState);
      setKendoFilterStatus(JSON.stringify(event.dataState));
    },
    [gridData]
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

  const commandCell = (props: GridCellProps) =>
    <CommandCell
      {...props}
      edit={edit}
      add={add}
      cancel={cancel}
      editField={editField}
    />
  ;

  const filterCellMapping = {
    groups: GroupDropdown,
    active: BooleanFilterCell,
  };

  const fieldToCellMapping = {
    "user.name": NameCell,
    "user.email": EmailCell,
    "groups": GroupsCell,
    "active": ActiveDropdown,
    "status": SignedCell,
    "": commandCell,
  };

  const columnRenderer = () => (
    sortBy(gridConfiguration.columns, ["orderIndex"]).map((column, idx) => (
      <GridColumn
        key={idx}
        {...column}
        minResizableWidth={100}
        cell={fieldToCellMapping[column.field]
          ? fieldToCellMapping[column.field] : undefined}
        filterCell={
          filterCellMapping[column.field]
            ? filterCellMapping[column.field]
            : undefined
        }
        headerCell={
          column.title ? (props) => <ColumnHeader data={props} /> : undefined
        }
      />
    )));

  const columnResize = (event: GridColumnResizeEvent) => {
    let dataColumns: KendoColumn[] = [...gridConfiguration.columns];
    dataColumns = map(dataColumns, (column: KendoColumn) => {
      const columnObject = find(event.columns, { field: column.field });
      column.width = columnObject?.width;
      return column;
    });
    setColumnDefinitions(dataColumns);
    updateDataColumnsState(dataColumns);
  };

  const columnReorder = (event: GridColumnReorderEvent) => {
    let dataColumns: KendoColumn[] = [...gridConfiguration.columns];
    dataColumns = map(dataColumns, (column: KendoColumn) => {
      const columnObject = find(event.columns, { field: column.field });
      column.orderIndex = columnObject?.orderIndex;
      return column;
    });
    setColumnDefinitions(dataColumns);
    updateDataColumnsState(dataColumns);
  };

  const defaultGroups = useSelector(userManagementSelectors.getDefaultGroups);

  const addNew = () => {
    clearFilter();
    const newDataItem: any = {
      id: generateUuid(),
      inEdit: true,
      active: true,
      groups: defaultGroups.map((el) => ({ id: el.value })) as [],
    };
    gridData.unshift(newDataItem);
    setResultState(processWithGroups(gridData, dataState));
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
      {isLoading && <Loader/>}
    </>
  );
  return (
    <>
      <Grid container justify="space-between">
        <Grid item>
          <Typography className={classes.title}>
            <Text translation="navigation.user.management"></Text>
          </Typography>
        </Grid>
        <Grid item style={{ display: "flex" }}>
          <EnableDropboxButton
            shouldDisplayButton={hasDropboxPermission}
            {...{ dropboxAsync, enableDropboxAction }}
            disabled={Boolean(isCompanyDropboxEnabled)}
          />
          <AddEmployeeContainer addGroup={addNew} />
        </Grid>
      </Grid>
      <Box className={classes.root}>
        <div style={{ color: "red" }}>{tableCriteria.apiError}</div>
        {tableRenderer()}
      </Box>
    </>
  );
}
