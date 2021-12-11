/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { DataResult, process, State } from "@progress/kendo-data-query";
import {
  setExpandedState,
  setGroupIds,
} from "@progress/kendo-react-data-tools";
import {
  Grid as KendoGrid, GridCellProps, GridColumn,
  GridDataStateChangeEvent,
  GridExpandChangeEvent,
  GridNoRecords,
  GridToolbar,
} from "@progress/kendo-react-grid";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { find, isEmpty, set } from "lodash";
import { denormalize } from "normalizr";
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as ViewGridIcon } from "../../../assets/images/grid_view.svg";
import { ReactComponent as SolidIcon } from "../../../assets/images/view.svg";
import { ReactComponent as ViewChecked } from "../../../assets/images/view_checked.svg";
import {
  getTableCriteria,
  getTableData,
} from "../../../common/utils/selectors";
import apiClient from "../../../state/apiClient";
import { authActions } from "../../../state/ducks/auth";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { LoadCompanyGroup } from "../../../state/ducks/userManagement/types";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import ClearFilters from "../../components/table/ClearFilters";
import DocumentInfo from "../../components/table/DocumentInfo";
import {
  TablePanelStateProps,
  TableStyleProps,
} from "../../components/table/types";
import Text from "../../components/Text";
import useDidMount from "../../hooks/useDidMount";
import AddGroupContainer from "../add.group/AddGroup.container";
import { CommandCell } from "./cell_template/commandCell";
import KendoGridStyles from "./kendogrid.styles";
import { TablePanelProps } from "./types";

type Props<T> = TablePanelProps<T>;

let call: CancelTokenSource;

export function KendoPanel<T extends any>({
  columns,
  queryUrl,
  tableName,
  onSelect,
  customDataSet,
  normalizrSchema,
  canCreateGroups,
}: Props<T>) {
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

  const edit = (dataItem: any) => {
    // eslint-disable-next-line no-console
    console.log("EDIT ROW");
    // enableInlineEdit(dataItem);
    onSelect && onSelect({ dataItem })();
  };
  const addGroup = () => {
    // eslint-disable-next-line no-console
    console.log("ADD GROUP");
    // Modify Here to change sample or editable data
    const sampleData = {
      name: "",
      employees: [],
      isOfficial: false,
      inEdit: true,
    };
    tableData.unshift(sampleData);
    setResultState(processWithGroups(tableData, dataState));
  };
  const update = (dataItem: LoadCompanyGroup) => {
    // eslint-disable-next-line no-console
    console.log("UPDATE", dataItem);
    enableInlineEdit(dataItem);
  };
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
        <CommandCell
          {...props}
          discard={discardEditMode}
          cancel={cancel}
          update={update}
          edit={edit}
        />
      );
    }
  });
  const initialKendoConfig: State = kendoConfigFromState
    ? JSON.parse(kendoConfigFromState)
    : {
      skip: 0,
      take: 25,
      group: [],
      // filter: {
      // logic: "and",
      // filters: [{ field: "isOfficial", operator: "eq", value: "(All)" }],
      // },
    };
  const setSearchStatus = (state?: LoadCompanyGroup) => {
    dataState.filter = {
      logic: "and",
      filters: state
        ? [{ field: "isOfficial", operator: "eq", value: "" }]
        : [],
    };
    // setDefaultDDItem("Select Type");
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
      field: "isOfficial",
    });
    if (stateFilerObject) {
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            queryDict: {
              state: stateFilerObject.value,
            },
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
  // const [defaultDDItem, setDefaultDDItem] = React.useState("Select Type");
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
        return resp;
      })
      .then(({ data }) => {
        if (customDataSet) {
          data = customDataSet(data);
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
    <div className={`k-loading-mask ${classes.loading}`}>
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
      filterable={column.filterable}
      groupable={column.groupable}
    />
  );
  const [coldef, setColdef] = React.useState(gridConfiguration.columns);
  const onChange = (item: any) => {
    const newState = [...coldef];
    newState.map((c, i) => {
      if (c.field === item.field) {
        c.show = !c.show;
      }
    });
    setColdef(newState);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          columnConfig: JSON.stringify(newState),
        },
        tableName
      )
    );
  };
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const editField = "inEdit";
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const enableInlineEdit = (dataItem: LoadCompanyGroup) => {
    dataItem.inEdit = !dataItem.inEdit;
    // eslint-disable-next-line no-console
    console.log("tableData ::", tableData);
    const index = tableData.findIndex((data) => data.id === dataItem.id);
    if (tableData[index]) {
      tableData[index].inEdit = dataItem.inEdit;
    }
    const newDataState = processWithGroups(tableData, dataState);
    setResultState(newDataState);
  };

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
      <KendoGrid
        className={`${classes.kGrid} ${classes.kGridFont}`}
        data={result}
        editField={editField}
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
        onRowClick={onSelect && (({ dataItem }) => onSelect({ dataItem })())}
        // onColumnResize={columnResize}
        // onColumnReorder={columnReorder}
      >
        <GridToolbar>
          <Grid container spacing={1} justify="space-between" alignItems="center">
            <Grid item>
              <ClearFilters {...{ clearFilter }} />
              <DocumentInfo numberOfRecords={tableData.length} />
            </Grid>
            <Grid item style={{ display: "flex" }}>
              {canCreateGroups && <AddGroupContainer addGroup={addGroup}/>}
              <FormControl variant="outlined">
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <ViewGridIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem>
                    <ListItemText
                      primary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.columnsCus}
                            color="textPrimary"
                          >
                            Columns
                          </Typography>
                        </>
                      }
                    ></ListItemText>
                  </MenuItem>
                  {gridConfiguration.columns.map((item: any) =>
                    item.field !== "crId" ? (
                      <MenuItem key={item.title} value={item.field}>
                        <ListItemText id={item.field} primary={item.title} />
                        <Box flexGrow={1} mr={5}></Box>
                        {item.show ? (
                          <ViewChecked
                            onClick={() => {
                              onChange(item);
                            }}
                          />
                        ) : (
                          <SolidIcon
                            onClick={() => {
                              onChange(item);
                            }}
                          />
                        )}
                      </MenuItem>
                    ) : null
                  )}
                </Menu>
              </FormControl>{" "}
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
