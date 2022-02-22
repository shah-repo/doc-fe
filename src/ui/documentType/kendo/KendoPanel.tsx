/* eslint-disable no-console */
import { Grid } from "@material-ui/core";
import { DataResult, process, State } from "@progress/kendo-data-query";
import {
  setExpandedState,
  setGroupIds,
} from "@progress/kendo-react-data-tools";
import {
  Grid as Kgrid,
  GridColumn,
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridDataStateChangeEvent,
  GridExpandChangeEvent,
  GridFilterCellProps,
  GridNoRecords,
  GridRowClickEvent,
  GridToolbar,
} from "@progress/kendo-react-grid";
import axios, { AxiosRequestConfig } from "axios";
import {
  cloneDeep, find,
  findIndex,
  has, isEmpty,
  map,
  merge,
  omit,
  pick, without,
} from "lodash";
import qs from "query-string";
import { ComponentType, default as React, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { AutoSizer, Size } from "react-virtualized";
import apiClient from "../../../state/apiClient";
import { authActions } from "../../../state/ducks/auth";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import { getSchemaFromColumns } from "../../common/utils/helpers";
import CellRender from "../../components/common/kendo.column.templates/CellRender";
import { ColumnMenu } from "../../components/common/kendo.column.templates/kendo.column.menu.templates/ColumnMenu";
import { RenderCustomCell } from "../../components/common/kendo.column.templates/RenderCellTemplate";
import ColumnHeader from "../../components/common/kendo/ColumnHeader";
import ColumnShowHideMenu from "../../components/common/kendo/ColumnShowHideMenu";
import {
  hideColumnTitleOnResize,
  orderByLockedState,
  pagerSettings,
  setColumnWidth,
} from "../../components/common/kendo/helpers";
import Loader from "../../components/common/kendo/Loader";
import NoDataFound from "../../components/common/kendo/NoDataFound";
import {
  KendoColumn,
  KendoPanelProps,
} from "../../components/common/kendo/types";
import KendoGlobalization from "../../components/KendoGlobalization";
import { toastError } from "../../components/notifications";
import ClearFilters from "../../components/table/ClearFilters";
import { canEditDocumentRevision } from "../../document.revision/utils/helpers";
import {
  documentEditPath,
  documentPreviewPath,
} from "../../document.revision/utils/paths";
import useDidMount from "../../hooks/useDidMount";
import GridStyles from "./styles";

interface CreateExport {
  dynamicColumns: KendoColumn[];
}
let call;

export function KendoGrid<T>({
  dynamicColumns,
  tableName,
  gridData,
  tableCriteria,
  queryUrl = "",
  customDataSet,
  exportDataChanges,
}: KendoPanelProps<T> & CreateExport) {
  const intl = useIntl();
  const getTranslatedText = (key: string) =>
    key ? intl.formatMessage({ id: key }) : "";
  const dispatch = useDispatch();
  const didMount = useDidMount();
  const [isLoading, setIsLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  const { columnConfig, queryDict, forceUpdate, apiError, kendoConfig } =
    tableCriteria;
  const [collapsedState, setCollapsedState] = React.useState<string[]>([]);
  const classes = GridStyles();
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

  const copyDynamicColumns = cloneDeep(dynamicColumns);
  const temp: KendoColumn[] = [];
  let configColumns: KendoColumn[] = [];
  const list = [
    "field",
    "title",
    "filter",
    "groupable",
    "width",
    "locked",
    "cell",
    "format",
    "showColumnMenu",
    "columnMenu",
    "filterCell",
    "show",
  ];
  const omitList = [
    "field",
    "title",
    "filter",
    "groupable",
    "cell",
    "format",
    "showColumnMenu",
    "columnMenu",
    "filterCell",
  ];
  copyDynamicColumns.forEach((o: KendoColumn) => {
    temp.push(pick(o, list) as KendoColumn);
  });
  if (columnConfig) {
    const savedconfig = JSON.parse(columnConfig);
    savedconfig.forEach((o: KendoColumn, i: number) => {
      configColumns.push(merge(temp[i], omit(o, omitList)));
    });
  } else {
    configColumns = configColumns.length === 0 ? temp : copyDynamicColumns;
  }
  const initialGridConfigurationColumns: KendoColumn[] = configColumns;
  const gropableColumnFields = without(
    initialGridConfigurationColumns.map((o) => (o.groupable ? o.field : "")),
    ""
  );
  const SchemaObj = getSchemaFromColumns(dynamicColumns);
  const queryApi = (updatedDataState?) => {
    const newDataState = updatedDataState ? updatedDataState : dataState;
    call?.cancel();
    console.log("dataState IN API:::", newDataState);
    call = axios.CancelToken.source();
    const requestConfig: AxiosRequestConfig = {
      method: "post",
      url: queryUrl,
      data: {
        documentTypeCategory: tableName?.split("-")[1],
        limit: newDataState.take,
        offset: newDataState.skip,
        filters: newDataState?.filter?.filters,
        sort: newDataState.sort,
        schema: SchemaObj,
      },
      paramsSerializer: (params) => qs.stringify(params),
      headers: {},
      cancelToken: call.token,
    };
    requestConfig.headers.Authorization = `bearer ${
      store.getState().auth.user.employeeId
    }:${store.getState().auth.user.sessionId}`;
    setIsLoading(true);
    setNoDataMessage(<span />);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          apiError: "",
          scrollToIndex: 0,
          forceUpdate: false,
          kendoConfig: JSON.stringify(newDataState),
          columnConfig: JSON.stringify(configColumns),
        },
        tableName
      )
    );
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        let fetchedData = data.results;
        if (customDataSet) {
          fetchedData = customDataSet(fetchedData);
        }
        fetchedData = map(fetchedData, (record) => {
          if (has(record, "precalc.po_amount")) {
            let poAmountValue = record.precalc.po_amount;
            if (poAmountValue === "N/A") {
              poAmountValue = "-1";
            }
            poAmountValue = +poAmountValue.replace(/[^0-9.-]+/g, "");
            // eslint-disable-next-line @typescript-eslint/camelcase
            record.precalc.po_amount_org = record.precalc.po_amount;
            // eslint-disable-next-line @typescript-eslint/camelcase
            record.precalc.po_amount = poAmountValue;
          }
          if (has(record, "precalc.lhr_end_accepted_quantity")) {
            if (record.precalc.lhr_end_accepted_quantity === "N/A") {
              // eslint-disable-next-line @typescript-eslint/camelcase
              record.precalc.lhr_end_accepted_quantity = -1;
            }
          }
          return record;
        });
        const newProcessedDataState = processWithGroups(fetchedData, newDataState);
        newProcessedDataState.total = data.total;
        setResultState(newProcessedDataState);
        exportDataChanges &&
          exportDataChanges(
            process(fetchedData, {
              skip: 0,
              take: fetchedData.total,
              sort: newDataState.sort,
              filter: newDataState.filter,
            }).data
          );
        setIsLoading(false);
        if (fetchedData.total === 0) {
          setNoDataMessage(<NoDataFound />);
        }
      })
      .catch((exception) => {
        if (axios.isCancel(exception)) {
          return;
        }
        setIsLoading(false);
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
              ...tableCriteria,
              apiError: "Error: " + errorMessage,
            },
            tableName
          )
        );
      });
  };
  useEffect(() => {
    if (didMount) {
      setDataState(initialDataState);
      queryApi(initialDataState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryDict, didMount, tableName]);

  useEffect(() => {
    if (forceUpdate) {
      queryApi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceUpdate]);

  const kendoConfigFromState = kendoConfig;
  const initialDataState: State = kendoConfigFromState
    ? JSON.parse(kendoConfigFromState)
    : { skip: 0, take: 25, group: [] };
  const processWithGroups = (data: T[], dataState: State) => {
    const dstate = cloneDeep(dataState);
    dstate.skip = 0;
    const newDataState = process(data, dstate);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };
  const [dataState, setDataState] = React.useState<State>(initialDataState);
  const [resultState, setResultState] = React.useState<DataResult>(
    processWithGroups(gridData, initialDataState)
  );
  const result = setExpandedState({
    data: resultState.data,
    collapsedIds: collapsedState,
  });
  const onExpandChange = React.useCallback(
    ({ dataItem, value }: GridExpandChangeEvent) => {
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
  // check if document is editable or readonly
  const canEdit = (data: DocumentRevision) => canEditDocumentRevision(data);
  // On Grid Row click
  const onRowClick = ({ dataItem }: GridRowClickEvent) => {
    if (isEmpty(dataItem.id) || isEmpty(dataItem.document.id)) {
      return false;
    }
    let urlPath = documentPreviewPath(dataItem.id, dataItem.document.id);
    if (canEdit(dataItem)) {
      urlPath = documentEditPath(dataItem.id, dataItem.document.id);
    }
    window.open(urlPath, "_self");
  };
  const onDataStateChange = React.useCallback(
    ({ dataState }: GridDataStateChangeEvent) => {
      const newDataState = processWithGroups(gridData, dataState);
      tableCriteria.kendoConfig = JSON.stringify(dataState);
      tableCriteria.columnConfig = JSON.stringify(columnDefinitions);
      setDataState(dataState);
      exportDataChanges &&
        exportDataChanges(
          process(gridData, {
            skip: 0,
            take: gridData.length,
            sort: dataState.sort,
            filter: dataState.filter,
          }).data
        );
      queryApi(dataState);
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
          },
          tableName
        )
      );
      if (!newDataState.total) {
        setNoDataMessage(<NoDataFound />);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridData]
  );

  const [columnDefinitions, setColumnDefinitions] =
    React.useState(configColumns);
  useEffect(() => {
    setColumnDefinitions(configColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName]);

  const onColumnResize = ({ end, columns }: GridColumnResizeEvent) => {
    hideColumnTitleOnResize();
    if (!end) {
      return false;
    }
    let dataColumns = columnDefinitions;
    dataColumns = map(dataColumns, (column: KendoColumn) => {
      const columnObject = find(columns, { field: column.field });
      column.width = columnObject ? columnObject.width : column.width;
      return column;
    });
    setTimeout(() => {
      setColumnDefinitions(dataColumns);
      updateDataColumnsState(dataColumns);
    }, 100);
  };

  const onColumnReorder = ({ columns }: GridColumnReorderEvent) => {
    let dataColumns = columnDefinitions;
    dataColumns = map(dataColumns, (column: KendoColumn) => {
      const columnObject = find(columns, { field: column.field });
      column.orderIndex = columnObject?.orderIndex;
      return column;
    });
    setColumnDefinitions(dataColumns);
    updateDataColumnsState(dataColumns);
  };

  const getFilterCell = (fieldName: string) => {
    const foundObj = configColumns.filter(
      ({ field }: KendoColumn) => field === fieldName
    );
    return foundObj.length ? foundObj[0].filterCell : undefined;
  };

  const sortedColumnDefinitions = orderByLockedState(
    columnDefinitions,
    gropableColumnFields
  );

  const renderKendoColumns = (gridWidth: number) =>
    sortedColumnDefinitions.map(
      (column: KendoColumn, index: number) =>
        column.show && (
          <GridColumn
            key={index}
            field={column.field}
            width={setColumnWidth(column.width as number, gridWidth)}
            minResizableWidth={200}
            locked={column.locked}
            reorderable={column.reorderable}
            sortable={column.sortable}
            groupable={column.groupable}
            title={column.title}
            filter={column.filter}
            filterCell={
              getFilterCell(column.field) as ComponentType<GridFilterCellProps>
            }
            headerCell={
              column.title ? (props) => <ColumnHeader {...props} /> : undefined
            }
            cell={(props) =>
              RenderCustomCell(
                { ...props, cellRowClick: onRowClick },
                column.cell || ""
              )
            }
            orderIndex={column.orderIndex}
            format={column.format}
            columnMenu={
              column.showColumnMenu
                ? (props) => (
                  <ColumnMenu
                    {...props}
                    columns={columnDefinitions}
                    tableName={tableName}
                  />
                )
                : undefined
            }
          />
        )
    );

  const clearFilter = () => {
    if (dataState?.filter?.filters?.length) {
      dataState.filter.filters = [];
      queryApi();
      tableCriteria.kendoConfig = JSON.stringify(dataState);
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
          },
          tableName
        )
      );
      const newDataState = processWithGroups(gridData, dataState);
      setDataState(dataState);
      setResultState(newDataState);
      exportDataChanges &&
        exportDataChanges(
          process(gridData, {
            skip: 0,
            take: gridData.length,
            sort: dataState.sort,
            filter: dataState.filter,
          }).data
        );
    }
  };

  const onColumnShowHide = ({ field }: KendoColumn) => {
    const isGrouped = findIndex(dataState.group, { field });
    if (isGrouped > -1) {
      toastError(getTranslatedText("common.no.hide"));
      return;
    }
    const updatedDataColumns = map(columnDefinitions, (column: KendoColumn) => {
      if (column.field === field) {
        column.show = !column.show;
      }
      return column;
    });
    setColumnDefinitions(updatedDataColumns);
    updateDataColumnsState(updatedDataColumns);
  };

  const renderKendoGrid = ({ width }: Size) => (
    <>
      {isLoading && <Loader />}
      <KendoGlobalization>
        <Kgrid
          cellRender={CellRender}
          className={classes.kGrid}
          style={{ width: `${width}px` }}
          data={result}
          sortable={true}
          filterable={true}
          reorderable={true}
          pageable={pagerSettings}
          resizable={true}
          groupable={true}
          total={resultState.total}
          onDataStateChange={onDataStateChange}
          {...dataState}
          onExpandChange={onExpandChange}
          expandField="expanded"
          onRowClick={onRowClick}
          onColumnResize={onColumnResize}
          onColumnReorder={onColumnReorder}
        >
          <GridToolbar>
            <Grid container spacing={1}>
              <Grid xs item>
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
          {renderKendoColumns(width)}
          <GridNoRecords>{noDataMessage}</GridNoRecords>
        </Kgrid>
      </KendoGlobalization>
    </>
  );
  const renderBody = () => <AutoSizer>{renderKendoGrid}</AutoSizer>;
  return (
    <>
      <div style={{ color: "red" }}>{apiError}</div>
      {renderBody()}
    </>
  );
}
