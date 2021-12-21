/* eslint-disable react-hooks/exhaustive-deps */
import { Box, FormControl, Grid, IconButton, ListItemText, Menu, MenuItem, Typography } from "@material-ui/core";
import { DataResult, orderBy, process, State } from "@progress/kendo-data-query";
import {
  setExpandedState,
  setGroupIds,
} from "@progress/kendo-react-data-tools";
import {
  Grid as KendoGrid, GridColumn,
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridDataStateChangeEvent,
  GridExpandChangeEvent,
  GridFilterCellProps,
  GridNoRecords,
  GridToolbar,
} from "@progress/kendo-react-grid";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { each, find, isEmpty, map, pick, set } from "lodash";
import { denormalize } from "normalizr";
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ReactComponent as ViewGridIcon } from "../../../assets/images/grid_view.svg";
import { ReactComponent as SolidIcon } from "../../../assets/images/view.svg";
import { ReactComponent as ViewChecked } from "../../../assets/images/view_checked.svg";
import apiClient from "../../../state/apiClient";
import { authActions } from "../../../state/ducks/auth";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import { getCellTemplate } from "../../components/common/kendo.column.templates/config";
import { ColumnMenu } from "../../components/common/kendo.column.templates/kendo.column.menu.templates/ColumnMenu";
import KendoGlobalization from "../../components/KendoGlobalization";
import ClearFilters from "../../components/table/ClearFilters";
import { TablePanelStateProps } from "../../components/table/types";
import Text from "../../components/Text";
import useDidMount from "../../hooks/useDidMount";
import { canEditDocumentRevision, documentRevisionQueryStatus } from "../utils/helpers";
import { DropdownFilterTemplate } from "./filter.template/DropdownFilterTemplate";
import KendoGridStyles from "./styles";
import { KendoPanelProps } from "./types";


type Props<T> = KendoPanelProps<T>;

let call: CancelTokenSource;

export function KendoPanel<T extends any>({
  columns,
  queryUrl = "",
  statuses,
  customDataSet,
  tableName,
  rootCustomStyle,
  normalizrSchema,
  editDocumentRevision,
  previewDocumentRevision,
  documentTypeOptions,
  tableCriteria,
  data,
}: Props<T>) {
  const didMount = useDidMount();
  const dispatch = useDispatch();
  const classes = KendoGridStyles();
  const [isLoading, setIsLoading] = useState(false);

  const updateDataColumnsState = (dataColumns) => {
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
  const kendoConfigColumn = tableCriteria.columnConfig;
  const gridConfiguration = columns;
  const initialGridConfiguration: {columns: any[]} = { ...gridConfiguration };

  // Check if the Column config available in State, if so prefer what is available in State
  if (kendoConfigColumn && JSON.parse(kendoConfigColumn).length) {
    gridConfiguration.columns = JSON.parse(kendoConfigColumn);
  }
  const [columnDefinitions, setColumnDefinitions] = React.useState(gridConfiguration.columns);

  const kendoConfigFromState = tableCriteria.kendoConfig;

  const initialDataState: State = kendoConfigFromState
    ? JSON.parse(kendoConfigFromState)
    : {
      skip: 0, take: 25, group: [],
      sort: [{ field: "document.docId", dir: "asc" }],
      // Initial filter descriptor
      filter: {
        logic: "and",
        filters: [{ field: "displayStatus", operator: "eq", value: "Released" }],
      },
    };
  const [defaultDDItem, setDefaultDDItem] = React.useState("Released");
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  useEffect(() => {
    if (didMount) {
      if (isEmpty(tableCriteria.queryDict)) {
        if (fireAPI) {
          queryApi();
        } else {
          if (defaultDDItem === "Released") {
            setSearchStatus(documentRevisionQueryStatus(),  "Released" as DocumentRevisionStatus);
          }
        }
      } else if  (fireAPI) {
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
        return resp;
      })
      .then(({ data }) => {
        if (customDataSet) {
          data = customDataSet(data);
          // For Kendo Date picker
          each(data, (o) => {
            o.effectiveDate = o.effectiveDate ? new Date(o.effectiveDate) : null;
          });
          const newDataState: any = processWithGroups(data, initialDataState);
          setDataState(initialDataState);
          setResultState(newDataState);
          if (data.length === 0) {
            setNoDataMessage(<Typography><Text translation="table.no.results.found"></Text></Typography>);
          }
        }
        data = map(data, (record) =>
          pick(record, [
            ...map(columns.columns, "field"),
            "id",
            "document.docId",
            "owner.user.avatar",
          ])
        );
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
  // Kendo Loader
  const loadingPanel = (
    isLoading && (<div className={`k-loading-mask ${classes.loading}`} >
      <div className="k-loading-image"></div>
      <div className="k-loading-color"></div>
    </div>)
  );
  const processWithGroups = (data: any[], dataState: State) => {
    const newDataState = process(data, dataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };
  const [dataState, setDataState] = useState<State>(initialDataState);
  const [collapsedState, setCollapsedState] = useState<string[]>([]);
  const [resultState, setResultState] = useState<DataResult>(
    processWithGroups(data, initialDataState)
  );
  const result = setExpandedState({
    data: resultState.data,
    collapsedIds: collapsedState,
  });
  const setKendoFilterStatus = (kendoConfig: string, tableCriteria: Partial<TablePanelStateProps>): void => {
    const kendoConfigObject = JSON.parse(kendoConfig);
    const statusFilterObj = find(kendoConfigObject.filter?.filters, { field: "displayStatus" });
    if (statusFilterObj) {
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            queryDict: {
              displayStatus: statusFilterObj.value,
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
            queryDict: { },
          },
          tableName
        )
      );
    }
  };


  const [fireAPI, setFireAPI] = useState(true);
  const onDataStateChange = useCallback(
    (event: GridDataStateChangeEvent) => {
      const newDataState = processWithGroups(data, event.dataState);
      tableCriteria.kendoConfig = JSON.stringify(event.dataState);
      setDataState(event.dataState);
      setResultState(newDataState);
      setKendoFilterStatus(JSON.stringify(event.dataState), tableCriteria);
    },
    [data]
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
  const onStateChange = (setDefault) => {
    if (setDefault) {
      setDefaultDDItem("Select State");
    }
    setFireAPI(true);
  };

  const StatusFilterTempalte = (props: GridFilterCellProps) => (
    <DropdownFilterTemplate
      {...props}
      data={statuses}
      defaultItem={"Select State"}
      defaultValue={defaultDDItem}
      onStateChange={onStateChange}
    />
  );

  const TypeFilterTemplate = (props: GridFilterCellProps) => (
    <DropdownFilterTemplate
      {...props}
      data={map(documentTypeOptions, "text")}
      defaultItem={"Select Type"}
      defaultValue={"Select Type"}
    />
  );
  const filterCellMapping = {
    "displayStatus": StatusFilterTempalte,
    "document.documentType.documentTypeAcronym": TypeFilterTemplate,
  };

  // Grid Columns
  const columnRenderer = (column: any, index: React.Key | undefined) => (
    <GridColumn
      key={index}
      {...column}
      cell={getCellTemplate(column.cell)}
      filterCell={
        filterCellMapping[column.field]  ? filterCellMapping[column.field] : undefined
      }
      columnMenu={
        column.showColumnMenu
          ? (props) => <ColumnMenu {...props} tableName={tableName} columns={columnDefinitions} />
          : undefined
      }
    />
  );

  // check if document is editable or readonly
  const canEdit = (data: DocumentRevision) => canEditDocumentRevision(data);

  // On Grid Row click
  const onRowClick = (rowData) => {
    if (canEdit(rowData.dataItem)) {
      editDocumentRevision(rowData.dataItem.id, rowData.dataItem.document.id);
    }
    previewDocumentRevision(rowData.dataItem.id, rowData.dataItem.document.id);
  };

  // To Clear filter api call
  const setSearchStatus = (
    status?: DocumentRevisionStatus | DocumentRevisionStatus[],
    displayStatus?: DocumentRevisionStatus
  ) => {
    // Clearing Kendo Grid Filter
    dataState.filter = {
      logic: "and",
      filters: [], // status ? [{ field: "displayStatus", operator: "eq", value: "Released" }] : [],
    };
    setDefaultDDItem("Select State");
    setDataState(dataState);
    tableCriteria.kendoConfig = JSON.stringify(dataState);
    setFireAPI(true);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {
            "status[]": status,
            displayStatus,
            "documentTypeWithoutCategory": true,
          },
        },
        tableName,
      ),
    );
  };

  const onChange = (item: any) => {
    const dataColumns = [...columnDefinitions];
    dataColumns.map((c, i) => {
      if (c.field === item.field) {
        c.show = !c.show;
      }
    });
    setColumnDefinitions(dataColumns);
    updateDataColumnsState(dataColumns);
  };

  const onColumnResize = (event: GridColumnResizeEvent) => {
    if (event.end) {
      let dataColumns = [...columnDefinitions];
      dataColumns = map(dataColumns, (column) => {
        const columnObject = find(event.columns, { field: column.field });
        column.width = columnObject?.width;
        return column;
      });
      setColumnDefinitions(dataColumns);
      updateDataColumnsState(dataColumns);
    }
    return false;
  };

  const onColumnReorder = (event: GridColumnReorderEvent) => {
    let dataColumns = [...columnDefinitions];
    dataColumns = map(dataColumns, (column) => {
      const columnObject = find(event.columns, { field: column.field });
      column.orderIndex = columnObject?.orderIndex;
      return column;
    });
    setColumnDefinitions(dataColumns);
    updateDataColumnsState(dataColumns);
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const sortedColumnDefinitions: any[] = orderBy([...columnDefinitions], [
    { field: "locked", dir: "desc" },
  ]);
  sortedColumnDefinitions.forEach((data, index) => {
    const stateFilerObject = initialGridConfiguration && find(initialGridConfiguration?.columns, { field: data.field });
    data.reorderable = !data.locked;
    data.sortable = !data.locked;
    data.orderIndex = data.locked ? 0 : data.orderIndex;
    data.groupable = data.locked ? !data.locked : stateFilerObject?.groupable;
  });
  const clearFilter = () => setSearchStatus();
  const renderKendoGrid = () => (
    <>
      <KendoGlobalization>
        <KendoGrid
          className= {classes.kGrid}
          data={result}
          total={resultState.total}
          pageable={gridConfiguration.pagerSettings}
          sortable={true}
          filterable={true}
          reorderable={true}
          resizable={true}
          groupable={true}
          onDataStateChange={onDataStateChange}
          onRowClick={onRowClick}
          {...dataState}
          onExpandChange={onExpandChange}
          expandField="expanded"
          onColumnResize={onColumnResize}
          onColumnReorder={onColumnReorder}
        >
          <GridToolbar>
            <Grid container spacing={1}>
              <Grid item={true} xs={6}  style={{ textAlign: "left" }}>
                <ClearFilters {...{ clearFilter }} />
              </Grid>
              <Grid item={true} xs={6}  style={{ textAlign: "right" }}>
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
                    {sortedColumnDefinitions.map((item: any) =>
                      item.field !== "document.docId" ? (
                        <MenuItem key={item.title} value={item.field}>
                          <ListItemText id={item.field} primary={item.title} />
                          <Box flexGrow={1} mr={5}></Box>
                          {item.show ? (
                            <SolidIcon
                              onClick={() => {
                                onChange(item);
                              }}
                            />
                          ) : (
                            <ViewChecked
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
                {/* </Grid> */}
              </Grid>
            </Grid>
          </GridToolbar>
          {sortedColumnDefinitions.map((column, idx) => {
            if (column.show) {
              return columnRenderer(column, idx);
            }
            return null;
          })}
          <GridNoRecords>
            {noDataMessage}
          </GridNoRecords>
        </KendoGrid>
      </KendoGlobalization>
      {isLoading && loadingPanel}
    </>
  );

  return (
    <Box className={rootCustomStyle ? rootCustomStyle : classes.root}>
      <div style={{ color: "red" }}>{tableCriteria.apiError}</div>
      {renderKendoGrid()}
    </Box>
  );
}
