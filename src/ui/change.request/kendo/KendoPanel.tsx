/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from "@material-ui/core";
import { DataResult, FilterDescriptor, process, State } from "@progress/kendo-data-query";
import {
  setExpandedState,
  setGroupIds,
} from "@progress/kendo-react-data-tools";
import {
  Grid as KendoGrid,
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
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { cloneDeep, compact, find, findIndex, isEmpty, map, startCase } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { AutoSizer, Size } from "react-virtualized";
import apiClient from "../../../state/apiClient";
import { authActions } from "../../../state/ducks/auth";
import {
  ChangeRequest,
  ChangeRequestStatus,
} from "../../../state/ducks/changeRequest/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import { ColumnMenu } from "../../components/common/kendo.column.templates/kendo.column.menu.templates/ColumnMenu";
import { RenderCustomCell } from "../../components/common/kendo.column.templates/RenderCellTemplate";
import ColumnHeader from "../../components/common/kendo/ColumnHeader";
import ColumnShowHideMenu from "../../components/common/kendo/ColumnShowHideMenu";
import { DisplayText, hideColumnTitleOnResize, orderByLockedState, setColumnWidth, TranslatedText } from "../../components/common/kendo/helpers";
import Loader from "../../components/common/kendo/Loader";
import NoDataFound from "../../components/common/kendo/NoDataFound";
import {
  KendoColumn,
  KendoPanelProps,
} from "../../components/common/kendo/types";
import KendoGlobalization from "../../components/KendoGlobalization";
import { toastError } from "../../components/notifications";
import ClearFilters from "../../components/table/ClearFilters";
import { TablePanelStateProps } from "../../components/table/types";
import useDidMount from "../../hooks/useDidMount";
import {
  canEditChangeRequest,
  changeRequestStatusOption,
} from "../utils/helpers";
import {
  changeRequestEditPath,
  changeRequestPreviewPath,
} from "../utils/paths";
import { DropdownFilterTemplate } from "./filter.template/DropdownFilterTemplate";
import KendoGridStyles from "./styles";

let call: CancelTokenSource;

export function KendoPanel<T>({
  gridConfiguration = { columns: [], pagerSettings: {}, groupableFields: [] },
  tableName,
  tableCriteria,
  queryUrl = "",
  normalizrSchema,
  currentUserEmail = "",
  exportDataChanges,
}: KendoPanelProps<T>) {
  const history = useHistory();
  const intl = useIntl();
  const classes = KendoGridStyles();
  const didMount = useDidMount();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [fireAPI, setFireAPI] = useState(true);
  const { columnConfig, kendoConfig } = tableCriteria;
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
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
  const [columnDefinitions, setColumnDefinitions] = useState(
    gridConfiguration.columns
  );


  let defaultStatus: string = ChangeRequestStatus.InReview;
  let initialDataState: State;

  if (kendoConfig) {
    initialDataState = JSON.parse(kendoConfig);
    if (initialDataState.filter?.filters.length) {
      const statusObject = find(initialDataState.filter?.filters, {
        field: "state",
      }) as FilterDescriptor;
      if (statusObject) {
        defaultStatus = statusObject.value;
      } else {
        defaultStatus = getTranslatedText(TranslatedText[DisplayText.SELECT_STATE]);
      }
    } else {
      defaultStatus = getTranslatedText(TranslatedText[DisplayText.SELECT_STATE]);
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
          { field: "state", operator: "eq", value: ChangeRequestStatus.InReview },
        ],
      },
    };
  }
  // useEffect(() => {
  //   if (!initialDataState.filter?.filters.length && defaultDDItem !== ChangeRequestStatus.InReview) {
  //     setSearchStatus(
  //       ChangeRequestStatus.InReview,
  //     );
  //   }

  // }, [tableName]);
  const [dataState, setDataState] = useState<State>(initialDataState);
  const [collapsedState, setCollapsedState] = useState<string[]>([]);
  const [defaultDDItem, setDefaultDDItem] = React.useState(defaultStatus);
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  useEffect(() => {
    if (didMount) {
      if (isEmpty(tableCriteria.queryDict)) {
        if (fireAPI) {
          queryApi();
        } else {
          if (defaultDDItem === ChangeRequestStatus.InReview) {
            setSearchStatus(
              ChangeRequestStatus.InReview,
            );
          }
        }
      } else if (fireAPI) {
        queryApi();
      }
    }
  }, [tableCriteria.kendoConfig, didMount]);

  useEffect(() => {
    if (tableCriteria.forceUpdate) {
      queryApi();
    }
  }, [tableCriteria.forceUpdate]);

  const queryApi = () => {
    const schemaField = [
      ...map(gridConfiguration.columns, "field"),
      ...compact(map(gridConfiguration.columns, "tooltipField")),
    ];
    // TODO: Check if ID is required
    schemaField.push("id");
    call?.cancel();
    call = axios.CancelToken.source();
    const requestConfig: AxiosRequestConfig = {
      method: "post",
      url: queryUrl,
      data: {
        limit: dataState.take,
        offset: dataState.skip,
        filters: dataState.filter?.filters,
        sort: dataState.sort,
        schema: schemaField,
      },
      cancelToken: call.token,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${
          store.getState().auth.user.sessionId
        }`,
      },
    };

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
      .then((resp) => resp)
      .then(({ data }) => {
        const newDataState = processWithGroups(data.results, dataState);
        newDataState.total = data.total;
        setResultState(newDataState);
        exportDataChanges &&
            exportDataChanges(
              process(data.results, {
                skip: 0,
                take: data.total,
                sort: initialDataState.sort,
                filter: initialDataState.filter,
              }).data
            );
        if (newDataState.total === 0) {
          setNoDataMessage(<NoDataFound />);
        }
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
    const dstate = cloneDeep(dataState);
    dstate.skip = 0;
    const newDataState = process(data, dstate);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };
  const [resultState, setResultState] = useState<DataResult>(
    processWithGroups([], initialDataState)
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
      field: "state",
    });
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
      delete tableCriteria?.queryDict?.displayStatus;
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

  // Column Menu Filters
  const StatusFilterTemplate = (props: GridFilterCellProps) => (
    <DropdownFilterTemplate
      {...props}
      data={changeRequestStatusOption().map((col) => col.value)}
      defaultItem={(getTranslatedText(TranslatedText[DisplayText.SELECT_STATE]))}
      defaultValue={defaultDDItem}
      onStateChange={onStateChange}
    />
  );
  const filterCellMapping = {
    state: StatusFilterTemplate,
  };

  const clearFilter = () => setSearchStatus(undefined, true);

  // Kendo Grid Actions Methods
  const onStateChange = (setDefault: boolean) => {
    if (setDefault) {
      setDefaultDDItem(
        getTranslatedText(TranslatedText[DisplayText.SELECT_STATE])
      );
    }
    setFireAPI(true);
  };
  const setSearchStatus = (
    state?: ChangeRequestStatus,
    isClearAll?: boolean
  ) => {
    dataState.filter = {
      logic: "and",
      filters:
        state && !isClearAll
          ? [{ field: "state", operator: "eq", value: ChangeRequestStatus.InReview }]
          : [],
    };
    if (isClearAll) {
      setDefaultDDItem(
        getTranslatedText(TranslatedText[DisplayText.SELECT_STATE])
      );
      setFireAPI(true);
    }
    setDataState(dataState);
    tableCriteria.kendoConfig = JSON.stringify(dataState);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: isClearAll
            ? {}
            : {
              state,
            },
        },
        tableName
      )
    );
  };
  const onColumnResize = ({ end, columns }: GridColumnResizeEvent) => {
    hideColumnTitleOnResize();
    if (end) {
      let dataColumns = columnDefinitions;
      dataColumns = map(dataColumns, (column) => {
        const columnObject = find(columns, { field: column.field });
        column.width = columnObject ? columnObject.width : column.width;
        return column;
      });
      setTimeout(() => {
        setColumnDefinitions(dataColumns);
        updateDataColumnsState(dataColumns);
      }, 100);
    }
    return false;
  };
  const onColumnReorder = ({ columns }: GridColumnReorderEvent) => {
    let dataColumns = columnDefinitions;
    dataColumns = map(dataColumns, (column) => {
      const columnObject = find(columns, { field: column.field });
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
  const onRowClick = ({ dataItem }: GridRowClickEvent) => {
    if (isEmpty(dataItem.id)) {
      return false;
    }
    let urlPath = changeRequestPreviewPath(dataItem.id);
    if (canEdit(dataItem)) {
      urlPath = changeRequestEditPath(dataItem.id);
    }
    history.push({ pathname: urlPath });
  };

  const onDataStateChange = useCallback(
    ({ dataState }: GridDataStateChangeEvent) => {
      tableCriteria.kendoConfig = JSON.stringify(dataState);
      setDataState(dataState);
      setFireAPI(true);
      setKendoFilterStatus(JSON.stringify(dataState), tableCriteria);
    },
    []
  );
  // const debounceFunction = debounce(onDataStateChange, 1000);
  const onExpandChange = useCallback(
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
  // On Show / Hide Column From Main Menu
  const onColumnShowHide = ({ field }: KendoColumn) => {
    const isGrouped = findIndex(dataState.group, { field });
    if (isGrouped > -1) {
      toastError(getTranslatedText("common.no.hide"));
      return;
    }
    const dataColumns = map(columnDefinitions, (column) => {
      if (column.field === field) {
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
  const renderKendoColumns = (
    column: KendoColumn,
    index: React.Key | undefined,
    gridWidth: number
  ) => (
    <GridColumn
      key={index}
      {...column}
      title={startCase(getTranslatedText(column.title))}
      cell={(props) =>
        RenderCustomCell(
          {
            ...props,
            cellRowClick: onRowClick,
            showTooltip: column.showTooltip,
            tooltipField: column.tooltipField,
          },
          column.cell || ""
        )
      }
      filterCell={filterCellMapping[column.field]}
      width={setColumnWidth(column.width as number, gridWidth)}
      minResizableWidth={200}
      headerCell={
        column.title ? (props) => <ColumnHeader {...props} /> : undefined
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
  const renderKendoGrid = ({ width }: Size) => (
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
          {sortedColumnDefinitions.map((column, idx) => column.show && renderKendoColumns(column, idx, width))}
          <GridNoRecords>{noDataMessage}</GridNoRecords>
        </KendoGrid>
      </KendoGlobalization>
      {isLoading && <Loader />}
    </>
  );
  const renderBody = () => <AutoSizer>{renderKendoGrid}</AutoSizer>;
  return (
    <>
      <div style={{ color: "red" }}>{tableCriteria.apiError}</div>
      {renderBody()}
    </>
  );
}
