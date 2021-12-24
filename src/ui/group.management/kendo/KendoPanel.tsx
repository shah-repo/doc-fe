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
import Loader from "../../components/common/kendo/Loader";
import { KendoColumn, KendoPanelProps } from "../../components/common/kendo/types";
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
  // TODO: Check If BELOW Props required
  const styleProps: TableStyleProps = {
    isSelectable: onSelect !== undefined,
  };
  const classes = KendoGridStyles(styleProps);
  const [Official, setOfficial] = useState(false);
  const tableData = gridData || [];
  const kendoConfigColumn = tableCriteria.columnConfig;
  // Check if the Column config available in State, if so prefer what is available in State
  if (kendoConfigColumn && JSON.parse(kendoConfigColumn).length) {
    gridConfiguration.columns = JSON.parse(kendoConfigColumn);
  }
  const processWithGroups = (data: T[], dataState: State) => {
    const newDataState = process(data, dataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };
  const kendoConfigFromState = tableCriteria.kendoConfig;
  const initialColumnsConfig = tableCriteria.columnConfig
    ? JSON.parse(tableCriteria.columnConfig)
    : [];

  const edit = (dataItem: GridRowClickEvent) => {
    // eslint-disable-next-line no-console
    console.log("EDIT ROW");
    // enableInlineEdit(dataItem);
    onSelect && onSelect({ dataItem })();
  };
  const addGroup = () => {
    clearFilter();
    // Modify Here to change sample or editable data
    const sampleData = {
      name: "",
      employees: [],
      parents: [],
      permissions: [],
      tags: [],
      isOfficial: Boolean(),
      inEdit: true,
    };
    tableData.unshift(sampleData as any);
    setResultState(processWithGroups(tableData, dataState));
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
    // eslint-disable-next-line no-console
    console.log("UPDATE", dataItem);
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
  gridConfiguration.columns.forEach((column: KendoColumn) => {
    const foundObj = initialColumnsConfig.find(
      (initialColumn: KendoColumn) => initialColumn.field === column.field
    );
    // further update all column fields here
    if (foundObj) {
      column.show = foundObj.show;
    }
    if (!column.field && !column.title) {
      // eslint-disable-next-line react/display-name
      column.cell = (props: GridCellProps) => (
        <CommandCell
          {...props}
          discard={discardEditMode}
          cancel={cancel}
          update={update}
          edit={edit}
        />
      );
    }
    if (column.field === "memberNames") {
      // eslint-disable-next-line react/display-name
      column.cell = (props: GridCellProps) => (
        <EmployeesCell {...props} employees={activeEmployees} />
      );
    }
    if (column.field === "name") {
      // eslint-disable-next-line react/display-name
      column.cell = (props: GridCellProps) => <NameCell {...props} />;
    }

    if (column.field === "isOfficial") {
      // eslint-disable-next-line react/display-name
      column.cell = (props: GridCellProps) => (
        <GroupCell {...props} isOfficial={Official} setOfficial={setOfficial} />
      );
      // eslint-disable-next-line react/display-name
      column.filterCell = (props: GridCellProps) => (
        <BooleanFilterCell {...props} />
      );
    }
    if (column.field === "formattedPermissions") {
      // eslint-disable-next-line react/display-name
      column.cell = (props: GridCellProps) => (
        <PermissionsCell {...props} isOfficial={Official} />
      );
    }
    if (column.field === "parentName") {
      // eslint-disable-next-line react/display-name
      column.cell = (props: GridCellProps) => (
        <ParentsCell {...props} isOfficial={Official} />
      );
    }
    if (column.field === "formattedTags") {
      // eslint-disable-next-line react/display-name
      column.cell = (props: GridCellProps) => (
        <TagsCell {...props} isOfficial={Official} />
      );
    }
  });
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
      filters: [],
    };
    dataState.group = [];
    dataState.sort = [];
    setDataState(dataState);
    setResultState(processWithGroups(tableData, dataState));
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
    tableCriteria: Partial<TablePanelStateProps>
  ): void => {
    const kendoConfigObject = JSON.parse(kendoConfig);
    const stateFilerObject = find(kendoConfigObject.filter?.filters, {
      field: "isOfficial",
    });
    if (stateFilerObject) {
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            queryDict: {},
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
              kendoConfig: JSON.stringify(initialKendoConfig),
              columnConfig: JSON.stringify(initialColumnsConfig),
            },
            tableName
          )
        );
      });
  };

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
  const columnRenderer = (column: KendoColumn, index: React.Key | undefined) => (
    <GridColumn
      key={index}
      field={column.field}
      title={column.title}
      cell={column.cell}
      filter={column.filter}
      filterable={column.filterable}
      filterCell={column.filterCell}
      groupable={column.groupable}
      locked={column.locked}
      width={column.width}
      reorderable={column.reorderable}
      resizable={column.resizable}
    />
  );

  const columnResize = (event: GridColumnResizeEvent) => {
    let dataColumns: KendoColumn[] = [...gridConfiguration.columns];
    dataColumns = map(dataColumns, (column: KendoColumn) => {
      const columnObject = find(event.columns, { field: column.field });
      column.width = columnObject?.width;
      return column;
    });
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

  const columnReorder = (event: GridColumnReorderEvent) => {
    let dataColumns: KendoColumn[] = [...gridConfiguration.columns];
    dataColumns = map(dataColumns, (column: KendoColumn) => {
      const columnObject = find(event.columns, { field: column.field });
      column.orderIndex = columnObject?.orderIndex;
      return column;
    });
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
  const editField = "inEdit";

  // const enableInlineEdit = (dataItem: GroupRequestBody) => {
  //   dataItem.inEdit = !dataItem.inEdit;
  //   // eslint-disable-next-line no-console
  //   console.log("tableData ::", tableData);
  //   const index = tableData.findIndex((data) => data.id === dataItem.id);
  //   if (tableData[index]) {
  //     tableData[index].inEdit = dataItem.inEdit;
  //   }
  //   const newDataState = processWithGroups(tableData, dataState);
  //   setResultState(newDataState);
  // };

  const discardEditMode = (dataItem: LoadCompanyGroup) => {
    // eslint-disable-next-line no-console
    console.log("tableData ::", tableData);
    const index = tableData.findIndex((data) => data.id === dataItem.id);
    if (tableData[index]) {
      tableData[index].inEdit = false;
    }
    const newDataState = processWithGroups(tableData, dataState);
    setResultState(newDataState);
  };
  const cancel = (dataItem: LoadCompanyGroup) => {
    tableData.splice(0, 1);
    const newDataState = processWithGroups(tableData, dataState);
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
              <Grid item style={{ display: "flex" }}>
                {canCreateGroups && <AddGroupContainer addGroup={addGroup} />}
              </Grid>
            </Grid>
          </GridToolbar>
          {sortBy(gridConfiguration.columns, ["orderIndex"]).map((column, idx) => {
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
      {isLoading && <Loader/>}
    </>
  );
  return (
    <Box className={classes.root}>
      <div style={{ color: "red" }}>{tableCriteria.apiError}</div>
      {tableRenderer()}
    </Box>
  );
}
