/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Typography } from "@material-ui/core";
import { DataResult, process, State } from "@progress/kendo-data-query";
import {
  setExpandedState,
  setGroupIds,
} from "@progress/kendo-react-data-tools";
import {
  Grid as KendoGrid, GridColumn, GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridDataStateChangeEvent,
  GridExpandChangeEvent,
  GridFilterCellProps,
  GridNoRecords,
  GridToolbar,
} from "@progress/kendo-react-grid";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { each, filter, find, isEmpty, map, pick, set } from "lodash";
import { denormalize } from "normalizr";
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AutoSizer, Size } from "react-virtualized";
import apiClient from "../../../state/apiClient";
import { authActions } from "../../../state/ducks/auth";
import {
  DocumentRevision,
  DocumentRevisionStatus,
} from "../../../state/ducks/documentRevisions/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import { DateDropdownFilterCell } from "../../components/common/kendo.column.templates/DateDropdownFilterCell";
import { ColumnMenu } from "../../components/common/kendo.column.templates/kendo.column.menu.templates/ColumnMenu";
import { RenderCustomCell } from "../../components/common/kendo.column.templates/RenderCellTemplate";
import ColumnShowHideMenu from "../../components/common/kendo/ColumnShowHideMenu";
import { hideColumnTitleOnResize, orderByLockedState, setColumnWidth } from "../../components/common/kendo/helpers";
import Loader from "../../components/common/kendo/Loader";
import { KendoColumn, KendoPanelProps } from "../../components/common/kendo/types";
import KendoGlobalization from "../../components/KendoGlobalization";
import ClearFilters from "../../components/table/ClearFilters";
import { TablePanelStateProps } from "../../components/table/types";
import Text from "../../components/Text";
import useDidMount from "../../hooks/useDidMount";
import {
  canEditDocumentRevision,
  documentRevisionEffectiveDateOption,
  documentRevisionQueryStatus,
} from "../utils/helpers";
import { DropdownFilterTemplate } from "./filter.template/DropdownFilterTemplate";
import KendoGridStyles from "./styles";

type Props<T> = KendoPanelProps<T>;

let call: CancelTokenSource;

export function KendoPanel<T extends any>({
  gridConfiguration = { columns: [], pagerSettings: {}, groupableFields: [] },
  queryUrl = "",
  statuses = [],
  customDataSet,
  tableName,
  rootCustomStyle,
  normalizrSchema,
  editDocumentRevision,
  previewDocumentRevision,
  documentTypeOptions,
  tableCriteria,
  gridData,
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
  const [columnDefinitions, setColumnDefinitions] = useState<KendoColumn[]>(
    gridConfiguration.columns
  );


  let defaultStatus = "Released";
  let initialDataState: State;

  if (kendoConfig) {
    initialDataState = JSON.parse(kendoConfig);
    if (initialDataState.filter?.filters.length) {
      const fObj: any = find(initialDataState.filter?.filters, {
        field: "displayStatus",
      }) || { field: null, value: null };
      if (fObj) {
        defaultStatus = fObj.value;
      } else {
        defaultStatus = "Select State";
      }
    } else {
      defaultStatus = "Select State";
    }
  } else {
    initialDataState = {
      skip: 0,
      take: 25,
      group: [],
      sort: [],
      filter: {
        logic: "and",
        filters: [
          { field: "displayStatus", operator: "eq", value: "Released" },
        ],
      },
    };
  }

  const [dataState, setDataState] = useState<State>(initialDataState);
  const [collapsedState, setCollapsedState] = useState<string[]>([]);

  const [defaultDDItem, setDefaultDDItem] = useState(defaultStatus);
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  const defaultItem = {
    text: "Select Item",
    value: "",
  };
  const dropdownFilterState = tableCriteria.queryDict ? tableCriteria.queryDict : {};
  const initialCompletedOnSelectedOption = dropdownFilterState.effectiveDate || defaultItem;
  const [completedOnSelectedOption, setCompletedOnSelectedOption] = React.useState(initialCompletedOnSelectedOption);
  useEffect(() => {
    if (didMount) {
      if (isEmpty(tableCriteria.queryDict)) {
        if (fireAPI) {
          queryApi();
        } else {
          if (defaultDDItem === "Released") {
            setSearchStatus(
              documentRevisionQueryStatus(),
              "Released" as DocumentRevisionStatus
            );
          }
        }
      } else if (fireAPI) {
        queryApi();
      }
    }
  }, [tableCriteria.kendoConfig, didMount, completedOnSelectedOption]);

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
        if (key === "effectiveDate") {
          if (value.value) {
            params[key] = value.value;
          }
        } else {
          params[key] = value;
        }
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
            o.effectiveDate = o.effectiveDate
              ? new Date(o.effectiveDate)
              : null;
          });
          const newDataState: any = processWithGroups(data, initialDataState);
          setDataState(initialDataState);
          setResultState(newDataState);
          if (data.length === 0) {
            setNoDataMessage(
              <Typography>
                <Text translation="table.no.results.found"></Text>
              </Typography>
            );
          }
        }
        data = map(data, (record) =>
          pick(record, [
            ...map(gridConfiguration.columns, "field"),
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
  // Kendo Helper Methods
  const processWithGroups = (data: T[], dataState: State) => {
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
  const setKendoFilterStatus = (
    kendoConfig: string,
    tableCriteria: Partial<TablePanelStateProps>
  ): void => {
    const kendoConfigObject = JSON.parse(kendoConfig);
    const statusFilterObj = find(kendoConfigObject.filter?.filters, {
      field: "displayStatus",
    });
    if (statusFilterObj) {
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            queryDict: {
              ...tableCriteria.queryDict,
              "status[]": documentRevisionQueryStatus(),
              "displayStatus": statusFilterObj.value,
              "documentTypeWithoutCategory": true,
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
          },
          tableName
        )
      );
    }
  };

  // Column Menu Filters
  const StatusFilterTempalte = (props: GridFilterCellProps) => (
    <DropdownFilterTemplate
      {...props}
      data={statuses as any[]}
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
  const CompletedOnFilterCell: any = (props: GridFilterCellProps) => (
    <DateDropdownFilterCell
      {...props}
      data={documentRevisionEffectiveDateOption()}
      defaultItem={completedOnSelectedOption}
      onStateChange={onEffectiveDateChange}
      defaultValue={completedOnSelectedOption}
      operator={"gt"}
    />
  );
  const filterCellMapping = {
    "displayStatus": StatusFilterTempalte,
    "document.documentType.documentTypeAcronym": TypeFilterTemplate,
    "effectiveDate": CompletedOnFilterCell,
  };

  const clearFilter = () => setSearchStatus(documentRevisionQueryStatus());

  // Kendo Grid Actions Methods
  const onStateChange = (setDefault: any) => {
    if (setDefault) {
      setDefaultDDItem("Select State");
      setSearchStatus(documentRevisionQueryStatus(), undefined, false);
    } else {
      setFireAPI(true);
    }
  };
  const onEffectiveDateChange = (setDefault: any) => {
    const updatedFilter = { ...setDefault.selectedItem, field: setDefault.parentField };
    if (setDefault.parentField === "effectiveDate") {
      setCompletedOnSelectedOption(updatedFilter);
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            queryDict: {
              ...tableCriteria.queryDict,
              effectiveDate: updatedFilter,
            },
          },
          tableName
        )
      );
    }
    setFireAPI(true);
  };
  const setSearchStatus = (
    status?: DocumentRevisionStatus | DocumentRevisionStatus[],
    displayStatus?: DocumentRevisionStatus,
    clearOtherFilter = true
  ) => {
    const currentFilters = dataState.filter?.filters || [];
    dataState.filter = {
      logic: "and",
      filters: clearOtherFilter ? [] : filter(currentFilters, (o: any) => o.field !== "displayStatus"),
    };
    setCompletedOnSelectedOption(defaultItem);
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
        tableName
      )
    );
  };
  const onColumnResize = (event: GridColumnResizeEvent) => {
    if (event.end) {
      let dataColumns = [...columnDefinitions];
      dataColumns = map(dataColumns, (column) => {
        const columnObject = find(event.columns, { field: column.field });
        column.width = columnObject ? columnObject.width : column.width;
        return column;
      });
      hideColumnTitleOnResize();
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
  const onRowClick = (rowData: { dataItem: DocumentRevision }) => {
    if (isEmpty(rowData.dataItem.id) || isEmpty(rowData.dataItem.document.id)) {
      return false;
    }
    if (canEditDocumentRevision(rowData.dataItem)) {
      editDocumentRevision &&
        editDocumentRevision(rowData.dataItem.id, rowData.dataItem.document.id);
    }
    previewDocumentRevision &&
      previewDocumentRevision(
        rowData.dataItem.id,
        rowData.dataItem.document.id
      );
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

  const sortedColumnDefinitions = orderByLockedState(
    columnDefinitions,
    gridConfiguration.groupableFields || []
  );

  // Render Kendo Columns
  const renderKendoColumns = (column: KendoColumn, index: React.Key | undefined, gridWidth: number) => (
    <GridColumn
      key={index}
      {...column}
      width={setColumnWidth(column.width as number, gridWidth)}
      minResizableWidth={100}
      cell={(props) => RenderCustomCell(props, column.cell)}
      filterCell={
        filterCellMapping[column.field]
          ? filterCellMapping[column.field]
          : undefined
      }
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
  const renderKendoGrid = ({ width, height }: Size) => (
    <>
      <KendoGlobalization>
        <KendoGrid
          className={classes.kGrid}
          style={{ width: `${width}px` }}
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
              <Grid item={true} xs={6} style={{ textAlign: "left" }}>
                <ClearFilters {...{ clearFilter }} />
              </Grid>
              <Grid item={true} xs={6} style={{ textAlign: "right" }}>
                <ColumnShowHideMenu
                  columnDefinition={sortedColumnDefinitions}
                  onChange={onColumnShowHide}
                />
              </Grid>
            </Grid>
          </GridToolbar>
          {sortedColumnDefinitions.map((column, idx) => {
            if (column.show) {
              return renderKendoColumns(column, idx, width);
            }
            return null;
          })}
          <GridNoRecords>{noDataMessage}</GridNoRecords>
        </KendoGrid>
      </KendoGlobalization>
      {isLoading && <Loader />}
    </>
  );
  const renderBody = () => <AutoSizer>{renderKendoGrid}</AutoSizer>;
  return (
    <Box className={rootCustomStyle ? rootCustomStyle : classes.root}>
      <div style={{ color: "red" }}>{tableCriteria.apiError}</div>
      {renderBody()}
    </Box>
  );
}


