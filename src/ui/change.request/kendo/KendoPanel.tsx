/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Typography } from "@material-ui/core";
import { DataResult, process, State } from "@progress/kendo-data-query";
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
  GridRowClickEvent,
  GridToolbar,
} from "@progress/kendo-react-grid";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { each, find, isEmpty, map, pick, set } from "lodash";
import { denormalize } from "normalizr";
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import apiClient from "../../../state/apiClient";
import { authActions } from "../../../state/ducks/auth";
import { ChangeRequest, ChangeRequestStatus } from "../../../state/ducks/changeRequest/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import { getCellTemplate } from "../../components/common/kendo.column.templates/config";
import { ColumnMenu } from "../../components/common/kendo.column.templates/kendo.column.menu.templates/ColumnMenu";
import ColumnShowHideMenu from "../../components/common/kendo/ColumnShowHideMenu";
import { orderByLockedState } from "../../components/common/kendo/helpers";
import Loader from "../../components/common/kendo/Loader";
import { KendoColumn, KendoPanelProps } from "../../components/common/kendo/types";
import KendoGlobalization from "../../components/KendoGlobalization";
import ClearFilters from "../../components/table/ClearFilters";
import { TablePanelStateProps } from "../../components/table/types";
import Text from "../../components/Text";
import useDidMount from "../../hooks/useDidMount";
import { canEditChangeRequest, changeRequestStatusOption } from "../utils/helpers";
import { changeRequestEditPath, changeRequestPreviewPath } from "../utils/paths";
import { DropdownFilterTemplate } from "./filter.template/DropdownFilterTemplate";
import KendoGridStyles from "./styles";

type Props<T> = KendoPanelProps<T>;

let call: CancelTokenSource;

export function KendoPanel<T extends any>({
  gridConfiguration,
  tableName,
  gridData,
  tableCriteria,
  queryUrl = "",
  customDataSet,
  rootCustomStyle,
  normalizrSchema,
  currentUserEmail = "",
}: Props<T>) {
  const classes = KendoGridStyles();
  const didMount = useDidMount();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [fireAPI, setFireAPI] = useState(true);
  const { columnConfig, kendoConfig } = tableCriteria;

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
  // Check if the Column config available in State, if so prefer what is available in State
  if (columnConfig && JSON.parse(columnConfig).length) {
    gridConfiguration.columns = JSON.parse(columnConfig);
  }
  const [columnDefinitions, setColumnDefinitions] = useState(gridConfiguration.columns);

  const initialDataState: State = kendoConfig
    ? JSON.parse(kendoConfig)
    : {
      skip: 0, take: 25, group: [],
      sort: [{ field: "crId", dir: "asc" }],
      // Initial filter descriptor
      filter: {
        logic: "and",
        filters: [{ field: "state", operator: "eq", value: "IN_REVIEW" }],
      },
    };
  const [dataState, setDataState] = useState<State>(initialDataState);
  const [collapsedState, setCollapsedState] = useState<string[]>([]);

  const [defaultDDItem, setDefaultDDItem] = React.useState("IN_REVIEW");
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  useEffect(() => {
    if (didMount) {
      if (isEmpty(tableCriteria.queryDict)) {
        if (fireAPI) {
          if (defaultDDItem === "IN_REVIEW") {
            setSearchStatus(ChangeRequestStatus.InReview);
          } else {
            queryApi();
          }
        } else {
          if (defaultDDItem === "IN_REVIEW") {
            setSearchStatus(ChangeRequestStatus.InReview);
          }
        }
      } else if  (fireAPI) {
        queryApi();
      }
    }
  }, [tableCriteria.kendoConfig, didMount]);

  useEffect(() => {
    if (tableCriteria.forceUpdate) {
      queryApi();
    }
  }, [tableCriteria.forceUpdate]);

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
            ...map(gridConfiguration.columns, "field"),
            "id",
            "crId",
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

  // Kendo Helper Methods
  const processWithGroups = (data: any[], dataState: State) => {
    const newDataState = process(data, dataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };
  const [resultState, setResultState] = useState<DataResult>(
    processWithGroups(gridData, initialDataState)
  );
  const result = setExpandedState({
    data: resultState.data,
    collapsedIds: collapsedState,
  });
  const setKendoFilterStatus = (kendoConfig: string, tableCriteria: Partial<TablePanelStateProps>): void => {
    const kendoConfigObject = JSON.parse(kendoConfig);
    const statusFilterObj = find(kendoConfigObject.filter?.filters, { field: "state" });
    if (statusFilterObj) {
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            queryDict: {
              state: statusFilterObj.value,
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

  // Column Menu Filters
  const StatusFilterTemplate: any = (props: GridFilterCellProps) => (<DropdownFilterTemplate
    {...props}
    data={changeRequestStatusOption().map((col) => col.value)}
    defaultItem={"Select State"}
    defaultValue={defaultDDItem}
    onStateChange={onStateChange}
  />);
  const filterCellMapping = {
    state: StatusFilterTemplate,
  };

  const clearFilter = () => setSearchStatus(undefined, true);

  // Kendo Grid Actions Methods
  const onStateChange = (setDefault: boolean) => {
    if (setDefault) {
      setDefaultDDItem("Select State");
    }
    setFireAPI(true);
  };
  const setSearchStatus = (state?: ChangeRequestStatus, isClearAll?: boolean) => {
    dataState.filter = {
      logic: "and",
      filters: state && !isClearAll
        ? [{ field: "state", operator: "eq", value: "IN_REVIEW" }]
        : [],
    };
    if (isClearAll) {
      setDefaultDDItem("Select State");
      setFireAPI(true);
    }
    setDataState(dataState);
    tableCriteria.kendoConfig = JSON.stringify(dataState);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: isClearAll ? {} : {
            state,
          },
        },
        tableName
      )
    );
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
  // check if document is editable or readonly
  const canEdit = (data: ChangeRequest) =>
    canEditChangeRequest({ dataProp: data, currentUserEmail });

  // On Grid Row click
  const onRowClick = (props: GridRowClickEvent) => {
    let urlPath = changeRequestPreviewPath(props.dataItem.id);
    if (canEdit(props.dataItem)) {
      urlPath = changeRequestEditPath(props.dataItem.id);
    }
    window.open(urlPath, "_self");
  };
  const onDataStateChange = useCallback(
    (event: GridDataStateChangeEvent) => {
      const newDataState = processWithGroups(gridData, event.dataState);

      tableCriteria.kendoConfig = JSON.stringify(event.dataState);
      setDataState(event.dataState);
      setResultState(newDataState);
      setKendoFilterStatus(JSON.stringify(event.dataState), tableCriteria);
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
    // On Show / Hide Column From Main Menu
  const onColumnShowHide = (item: KendoColumn) => {
    const dataColumns = map([...columnDefinitions], (column) => {
      if (column.field === item.field) {
        column.show = !column.show;
      }
      return column;
    });
    setColumnDefinitions(dataColumns);
    updateDataColumnsState(dataColumns);
  };

  const sortedColumnDefinitions = orderByLockedState(columnDefinitions, gridConfiguration.groupableFields);

  // Render Kendo Columns
  const renderKendoColumns = (column: any, index: React.Key | undefined) => (
    <GridColumn
      key={index}
      {...column}
      cell={getCellTemplate(column.cell)}
      filterCell={filterCellMapping[column.field]}
      columnMenu={
        column.showColumnMenu
          ? (props) => (
            <ColumnMenu
              {...props}
              tableName={tableName}
              columns={columnDefinitions}
            />
          )
          : undefined
      }
    />
  );
  // Render Kendo Columns
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
                <ColumnShowHideMenu
                  restrictedColumns={["crId"]}
                  columnDefinition={sortedColumnDefinitions}
                  onChange={onColumnShowHide}
                />
              </Grid>
            </Grid>
          </GridToolbar>
          {sortedColumnDefinitions.map((column, idx) => {
            if (column.show) {
              return renderKendoColumns(column, idx);
            }
            return null;
          })}
          <GridNoRecords>
            {noDataMessage}
          </GridNoRecords>
        </KendoGrid>
      </KendoGlobalization>
      {isLoading && <Loader />}
    </>
  );
  return (
    <Box className={rootCustomStyle ? rootCustomStyle : classes.root}>
      <div style={{ color: "red" }}>{tableCriteria.apiError}</div>
      {renderKendoGrid()}
    </Box>
  );
}
