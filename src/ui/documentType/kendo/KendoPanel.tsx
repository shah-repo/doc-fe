/* eslint-disable no-console */
import { Box, Grid } from "@material-ui/core";
import {
  DataResult, process,
  State,
} from "@progress/kendo-data-query";
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
  cloneDeep, find, findIndex, isEmpty,
  map,
  merge,
  omit,
  pick,
  set,
  without,
} from "lodash";
import { denormalize } from "normalizr";
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
import { ColumnMenu } from "../../components/common/kendo.column.templates/kendo.column.menu.templates/ColumnMenu";
import { RenderCustomCell } from "../../components/common/kendo.column.templates/RenderCellTemplate";
import ColumnHeader from "../../components/common/kendo/ColumnHeader";
import ColumnShowHideMenu from "../../components/common/kendo/ColumnShowHideMenu";
import { hideColumnTitleOnResize, orderByLockedState, pagerSettings, setColumnWidth } from "../../components/common/kendo/helpers";
import Loader from "../../components/common/kendo/Loader";
import NoDataFound from "../../components/common/kendo/NoDataFound";
import { KendoColumn, KendoPanelProps } from "../../components/common/kendo/types";
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
  normalizrSchema,
}: KendoPanelProps<T> & CreateExport) {
  const intl = useIntl();
  const getTranslatedText = (key: string) => key ? intl.formatMessage({ id: key }) : "";
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
  const gropableColumnFields = without(initialGridConfigurationColumns.map((o) => o.groupable ? o.field : ""), "");

  const formatParams = () => {
    const params: any = {};
    if (!queryDict) {
      return;
    }
    Object.entries(queryDict).forEach(([key, value]) => {
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
    setDataState(initialDataState);
    setResultState(processWithGroups([], initialDataState));
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
          columnConfig: JSON.stringify(configColumns),
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
        }
        const newDataState = processWithGroups(data, initialDataState);
        setDataState(initialDataState);
        setResultState(newDataState);
        setIsLoading(false);
        if (newDataState.total === 0) {
          setNoDataMessage(<NoDataFound />);
        }
        data = map(data, (record) =>
          pick(record, [
            ...map(dynamicColumns, "field"),
            "id",
            "document.id",
            "owner.user.avatar",
          ])
        );
        dispatch(tableSearchActions.setData(data, tableName));
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
              queryDict: {},
              apiError: "Error: " + errorMessage,
              forceUpdate: false,
              kendoConfig: JSON.stringify(initialDataState),
              columnConfig: JSON.stringify(configColumns),
            },
            tableName
          )
        );
      });
  };
  useEffect(() => {
    if (didMount) {
      queryApi();
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
    const cloneDeepDataState = cloneDeep(dataState);
    const newDataState = process(data, cloneDeepDataState);
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
    let urlPath = documentPreviewPath(
      dataItem.id,
      dataItem.document.id
    );
    if (canEdit(dataItem)) {
      urlPath = documentEditPath(
        dataItem.id,
        dataItem.document.id
      );
    }
    window.open(urlPath, "_self");
  };
  const onDataStateChange = React.useCallback(
    ({ dataState }: GridDataStateChangeEvent) => {
      const newDataState = processWithGroups(gridData, dataState);
      tableCriteria.kendoConfig = JSON.stringify(dataState);
      tableCriteria.columnConfig = JSON.stringify(columnDefinitions);
      setDataState(dataState);
      setResultState(newDataState);
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
    if (!end) { return false; }
    let dataColumns = columnDefinitions;
    dataColumns = map(dataColumns, (column: KendoColumn) => {
      const columnObject = find(columns, { field: column.field });
      column.width = columnObject ? columnObject.width : column.width;
      return column;
    });
    hideColumnTitleOnResize();
    setColumnDefinitions(dataColumns);
    updateDataColumnsState(dataColumns);
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
    const foundObj = configColumns.filter(({ field }: KendoColumn) => field === fieldName);
    return foundObj.length ? foundObj[0].filterCell : undefined;
  };

  const sortedColumnDefinitions = orderByLockedState(columnDefinitions, gropableColumnFields);

  const renderKendoColumns = (gridWidth: number) =>
    sortedColumnDefinitions.map((column: KendoColumn, index: number) => column.show && (
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
        filterCell={getFilterCell(column.field) as ComponentType<GridFilterCellProps>}
        headerCell={
          column.title
            ? (props) => <ColumnHeader {...props} />
            : undefined
        }
        cell={(props) => RenderCustomCell({ ...props, cellRowClick: onRowClick }, column.cell || "")}
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
    ));

  const clearFilter = () => {
    if (dataState?.filter?.filters?.length) {
      dataState.filter.filters = [];
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
    <Box className={classes.root}>
      <div style={{ color: "red" }}>{apiError}</div>
      {renderBody()}
    </Box>
  );
}
