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
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridDataStateChangeEvent,
  GridExpandChangeEvent,
  GridNoRecords,
  GridRowClickEvent,
  GridToolbar,
} from "@progress/kendo-react-grid";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { find, isEmpty, map, set, sortBy } from "lodash";
import { denormalize } from "normalizr";
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import apiClient from "../../../state/apiClient";
import { authActions } from "../../../state/ducks/auth";
import { groupManagementActions } from "../../../state/ducks/groupManagement";
import { GroupRequestBody } from "../../../state/ducks/groupManagement/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { userManagementActions } from "../../../state/ducks/userManagement";
import {
  GetEmployeeResponse,
  LoadCompanyGroup,
} from "../../../state/ducks/userManagement/types";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import ColumnHeader from "../../components/common/kendo/ColumnHeader";
import { hideColumnTitleOnResize } from "../../components/common/kendo/helpers";
import Loader from "../../components/common/kendo/Loader";
import { KendoColumn, KendoPanelProps } from "../../components/common/kendo/types";
import KendoGlobalization from "../../components/KendoGlobalization";
import { toastError } from "../../components/notifications";
import ClearFilters from "../../components/table/ClearFilters";
import {
  TablePanelStateProps,
} from "../../components/table/types";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDidMount from "../../hooks/useDidMount";
import AddGroupContainer from "../add.group/AddGroup.container";
import { DEFAULT_ACTIVE_EMPLOYEES } from "../utils/types";
import { BooleanFilterCell } from "./cell.template/BooleanFilterCell";
import { CommandCell } from "./cell.template/CommandCell";
import { EmployeesCell } from "./cell.template/EmployeesCell";
import { GroupCell } from "./cell.template/GroupCell";
import { NameCell } from "./cell.template/NameCell";
import { ParentsCell } from "./cell.template/ParentsCell";
import { PermissionsCell } from "./cell.template/PermissionsCell";
import { TagsCell } from "./cell.template/TagsCell";
import KendoGridStyles from "./styles";

interface GroupManagementProps {
  onSelect: any;
  refreshTable: boolean;
  canCreateGroups: boolean;
}

type Props<T> = KendoPanelProps<T> & GroupManagementProps;

let call: CancelTokenSource;

export function KendoPanel<T extends any>({
  gridConfiguration = { columns: [], pagerSettings: {}, groupableFields: [] },
  tableName,
  gridData,
  tableCriteria,
  queryUrl,
  onSelect,
  refreshTable,
  normalizrSchema,
  canCreateGroups,
}: Props<T>) {
  const didMount = useDidMount();
  const dispatch = useDispatch();
  const classes = KendoGridStyles();
  const [Official, setOfficial] = useState(false);
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

  const edit = (dataItem: GridRowClickEvent) => {
    onSelect && onSelect({ dataItem })();
  };
  const addGroup = () => {
    setSearchStatus(true);
    const sampleData = {
      name: "",
      employees: [],
      parents: [],
      permissions: [],
      tags: [],
      isOfficial: Boolean(),
      inEdit: true,
    };
    gridData.unshift(sampleData as any);
    setResultState(processWithGroups(gridData, dataState));
  };
  const createGroupAsync = useAsync({
    onSuccess: (response) => {
      queryApi();
    },
    onError: (error) => {
      toastError(error as string);
    },
  });
  const handleCreate = (values: GroupRequestBody) => {
    dispatch(groupManagementActions.createGroup(values, createGroupAsync));
  };

  const update = (dataItem: GroupRequestBody) => {
    const payload = {
      defaultForNewUsers: false,
      name: dataItem.name,
      employees: dataItem.employees,
      isOfficial: Official,
      parents: dataItem.parents,
      permissions: dataItem.permissions,
      tags: dataItem.tags,
    };
    handleCreate(payload);
  };

  let initialDataState: State;

  if (kendoConfig) {
    initialDataState = JSON.parse(kendoConfig);
  } else  {
    initialDataState = {
      filter:
        {
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
    setResultState(processWithGroups(gridData, dataState));
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
    tableCriteria: Partial<TablePanelStateProps>
  ): void => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  const [fireAPI, setFireAPI] = useState(true);
  const [dataState, setDataState] = useState<State>(initialDataState); // Kendo Grid Data State
  const [collapsedState, setCollapsedState] = useState<string[]>([]);
  const [resultState, setResultState] = useState<DataResult>(
    processWithGroups(gridData, initialDataState)
  );
  // EMPLOYEES
  const [activeEmployees, setActiveEmployees] = useState<GetEmployeeResponse[]>(
    DEFAULT_ACTIVE_EMPLOYEES
  );
  const getEmployeeAction = useActionCreator(userManagementActions.getEmployee);
  const asyncGetActiveEmployees = useAsync<GetEmployeeResponse[]>({
    onSuccess: (data: GetEmployeeResponse[] = []) => {
      setActiveEmployees(data);
    },
  });
  useEffect(() => {
    if (didMount) {
      asyncGetActiveEmployees.start(
        getEmployeeAction,
        { active: true },
        asyncGetActiveEmployees
      );
    }
  }, [didMount]);
  useEffect(() => {
    if (didMount && refreshTable) {
      queryApi();
    }
  }, [refreshTable]);
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
  const formatParams = () => {
    const params: any = {};
    if (!tableCriteria.queryDict) {
      return;
    }
    Object.entries(tableCriteria.queryDict).forEach(([key, value]) => {
      if (key.startsWith("dynamicParams")) {
        set(params, key, value);
      } else {
        params[key] = value;
      }
    });
    params.dynamicParams = JSON.stringify(params.dynamicParams);
    return params;
  };
  const queryApi = () => {
    call?.cancel();
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
        resp.data = resp.data.map((el) => ({
          ...el,
          memberNames: el.employees.map((e) => e.user.name.trimLeft().trimEnd()).sort().join(", ") || "",
          parentName: el.parents.map((e) => e.name.trimLeft().trimEnd()).sort().join(", ") || "",
          formattedTags: el?.tags?.sort().join(", ") || "",
          formattedPermissions: el?.permissions?.sort().join(", ") || "",
        }));
        return resp;
      })
      .then(({ data }) => {
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
        // }
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
      setKendoFilterStatus(tableCriteria);
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
  const clearFilter = () => setSearchStatus(false);

  const commandCell = (props: GridCellProps) =>
    <CommandCell
      {...props}
      discard={discardEditMode}
      cancel={cancel}
      update={update}
      edit={edit}
    />
  ;

  const employeeCell = (props: GridCellProps) =>
    <EmployeesCell
      {...props}
      employees={activeEmployees}
    />
      ;

  const groupCell = (props: GridCellProps) =>
    <GroupCell {...props} isOfficial={Official} setOfficial={setOfficial} />;

  const tagCell = (props: GridCellProps) =>
    <TagsCell {...props} isOfficial={Official} />;

  const parentCell = (props: GridCellProps) =>
    <ParentsCell {...props} isOfficial={Official} />;

  const permissionCell = (props: GridCellProps) =>
    <PermissionsCell {...props} isOfficial={Official} />;

  const filterCellMapping = {
    isOfficial: BooleanFilterCell,
  };

  const fieldToCellMapping = {
    "memberNames": employeeCell,
    "name": NameCell,
    "isOfficial": groupCell,
    "formattedPermissions": permissionCell,
    "parentName": parentCell,
    "formattedTags": tagCell,
    "": commandCell,
  };

  const columnRenderer = () => (
    sortBy(columnDefinitions, ["orderIndex"]).map((column, idx) => (
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
    if (event.end) {
      let dataColumns: KendoColumn[] = [...gridConfiguration.columns];
      dataColumns = map(dataColumns, (column: KendoColumn) => {
        const columnObject = find(event.columns, { field: column.field });
        column.width = columnObject?.width;
        return column;
      });
      hideColumnTitleOnResize();
      setColumnDefinitions(dataColumns);
      updateDataColumnsState(dataColumns);
    }
    return false;
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
  const editField = "inEdit";

  const discardEditMode = (dataItem: LoadCompanyGroup) => {
    const index = gridData.findIndex((data) => data.id === dataItem.id);
    if (gridData[index]) {
      gridData[index].inEdit = false;
    }
    const newDataState = processWithGroups(gridData, dataState);
    setResultState(newDataState);
  };
  const cancel = (dataItem: LoadCompanyGroup) => {
    gridData.splice(0, 1);
    const newDataState = processWithGroups(gridData, dataState);
    setResultState(newDataState);
  };

  const tableRenderer = () => (
    <>
      <KendoGlobalization>
        <KendoGrid
          className={`${classes.kGrid} no-row-pointer`}
          data={result}
          editField={editField}
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
          // onRowClick={onSelect && (({ dataItem }) => !dataItem.inEdit && onSelect({ dataItem })())}
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
            <Text translation="navigation.group.management"></Text>
          </Typography>
        </Grid>
        <Grid item  style={{ marginBottom: 10 }}>
          {canCreateGroups && <AddGroupContainer addGroup={addGroup} />}
        </Grid>
      </Grid>
      <Box className={classes.root}>
        <div style={{ color: "red" }}>{tableCriteria.apiError}</div>
        {tableRenderer()}
      </Box>
    </>
  );
}
