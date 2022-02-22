import { Grid } from "@material-ui/core";
import { DataResult, FilterDescriptor, process, State } from "@progress/kendo-data-query";
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
import { cloneDeep, filter, find, findIndex, isEmpty, map } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
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
import { getSchemaFromColumns } from "../../common/utils/helpers";
import { DateDropdownFilterCell } from "../../components/common/kendo.column.templates/DateDropdownFilterCell";
import { ColumnMenu } from "../../components/common/kendo.column.templates/kendo.column.menu.templates/ColumnMenu";
import { RenderCustomCell } from "../../components/common/kendo.column.templates/RenderCellTemplate";
import ColumnHeader from "../../components/common/kendo/ColumnHeader";
import ColumnShowHideMenu from "../../components/common/kendo/ColumnShowHideMenu";
import { DisplayText, hideColumnTitleOnResize, orderByLockedState, setColumnWidth, TranslatedText } from "../../components/common/kendo/helpers";
import Loader from "../../components/common/kendo/Loader";
import NoDataFound from "../../components/common/kendo/NoDataFound";
import { DateFilterStateChangeProps, KendoColumn, KendoPanelProps } from "../../components/common/kendo/types";
import KendoGlobalization from "../../components/KendoGlobalization";
import { toastError } from "../../components/notifications";
import ClearFilters from "../../components/table/ClearFilters";
import { TablePanelStateProps } from "../../components/table/types";
import useDidMount from "../../hooks/useDidMount";
import {
  canEditDocumentRevision,
  documentRevisionEffectiveDateOption,
  documentRevisionQueryStatus,
} from "../utils/helpers";
import { DropdownFilterTemplate } from "./filter.template/DropdownFilterTemplate";
import KendoGridStyles from "./styles";

let call: CancelTokenSource;
export function KendoPanel<T>({
  gridConfiguration = { columns: [], pagerSettings: {}, groupableFields: [] },
  queryUrl = "",
  statuses = [],
  customDataSet,
  tableName,
  editDocumentRevision,
  previewDocumentRevision,
  documentTypeOptions,
  tableCriteria,
  gridData,
  exportDataChanges,
}: KendoPanelProps<T>) {
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
  const [columnDefinitions, setColumnDefinitions] = useState<KendoColumn[]>(
    gridConfiguration.columns
  );


  let defaultStatus: string = DocumentRevisionStatus.Released;
  let initialDataState: State;
  if (kendoConfig) {
    initialDataState = JSON.parse(kendoConfig);
    if (initialDataState.filter?.filters.length) {
      const fObj = find(initialDataState.filter?.filters, {
        field: "displayStatus",
      }) as FilterDescriptor;
      if (fObj) {
        defaultStatus = fObj.value;
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
          { field: "displayStatus", operator: "eq", value: "Released" as DocumentRevisionStatus },
        ],
      },
    };
  }

  const [dataState, setDataState] = useState<State>(initialDataState);
  const [collapsedState, setCollapsedState] = useState<string[]>([]);

  const [defaultDDItem, setDefaultDDItem] = useState(defaultStatus);
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  const defaultItem = {
    text: (getTranslatedText(TranslatedText[DisplayText.SELECT_ITEM])),
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
          if (defaultDDItem === DocumentRevisionStatus.Released) {
            setSearchStatus(
              documentRevisionQueryStatus(),
              DocumentRevisionStatus.Released
            );
          }
        }
      } else if (fireAPI) {
        queryApi();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableCriteria.kendoConfig, didMount, completedOnSelectedOption]);

  useEffect(() => {
    if (tableCriteria.forceUpdate) {
      queryApi();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableCriteria.forceUpdate]);

  const formatParams = () => {
    const params: any = {};
    if (!tableCriteria.queryDict) {
      return;
    }
    Object.entries(tableCriteria.queryDict).forEach(([key, value]) => {
      if (key === "effectiveDate") {
        if (value.value) {
          params[key] = value.value;
        }
      } else {
        params[key] = value;
      }
    });
    // params.dynamicParams = JSON.stringify(params.dynamicParams);
    return params;
  };

  const formatParamsToKendoGridPayload = () => {
    interface FilterObjKendo {
      field: string;
      operator: string;
      value: string | boolean;
    }
    let kendoFilterObj: FilterObjKendo[] = [];
    const params = formatParams();
    const copyParams = cloneDeep(params);
    delete copyParams["status[]"];
    kendoFilterObj = map(copyParams, (val, key) => ({
      field: key,
      operator: "eq",
      value: val  || "",
    }));
    return kendoFilterObj;
  };

  const queryApi = () => {
    const queryPayload = formatParamsToKendoGridPayload();
    call?.cancel();
    call = axios.CancelToken.source();
    const requestConfig: AxiosRequestConfig = {
      method: "post",
      url: queryUrl,
      data: {
        documentTypeWithoutCategory: "true",
        limit: dataState.take,
        offset: dataState.skip,
        filters: queryPayload,
        sort: dataState.sort,
        schema: getSchemaFromColumns(gridConfiguration.columns),
      },
      headers: {},
      cancelToken: call.token,
    };
    requestConfig.headers.Authorization = `bearer ${
      store.getState().auth.user.employeeId
    }:${store.getState().auth.user.sessionId}`;
    setIsLoading(true);
    setNoDataMessage(<span />);
    // dispatch(tableSearchActions.setData([], tableName));
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
      .then(({ data }) => {
        const newDataState = processWithGroups(data.results, initialDataState);
        newDataState.total = data.total;
        setDataState(initialDataState);
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
              ...tableCriteria,
              apiError: "Error: " + errorMessage,
            },
            tableName
          )
        );
      });
  };
  // Kendo Helper Methods
  const processWithGroups = (data: T[], dataState: State) => {
    const dataStateOne = cloneDeep(dataState);
    dataStateOne.skip = 0;
    const newDataState = process(data, dataStateOne);
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
      data={statuses as DocumentRevisionStatus[]}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.SELECT_STATE],
      })}
      defaultValue={defaultDDItem}
      onStateChange={onDisplayStatusChange}
    />
  );
  const TypeFilterTemplate = (props: GridFilterCellProps) => (
    <DropdownFilterTemplate
      {...props}
      data={map(documentTypeOptions, "text")}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.SELECT_TYPE],
      })}
      defaultValue={intl.formatMessage({
        id: TranslatedText[DisplayText.SELECT_TYPE],
      })}
    />
  );
  const EffectiveDateFilterCell = (props: GridFilterCellProps) => (
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
    "effectiveDate": EffectiveDateFilterCell,
  };

  const clearFilter = () => setSearchStatus(documentRevisionQueryStatus());

  const onDisplayStatusChange = (setDefault: boolean) => {
    if (setDefault) {
      setDefaultDDItem(
        getTranslatedText(TranslatedText[DisplayText.SELECT_STATE])
      );
    }
    setFireAPI(true);
  };

  const onEffectiveDateChange = (setDefault: DateFilterStateChangeProps) => {
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
      filters: clearOtherFilter
        ? []
        : filter(currentFilters as FilterDescriptor[], (filter) => filter.field !== "displayStatus"),
    };
    setCompletedOnSelectedOption(defaultItem);
    setDefaultDDItem(
      getTranslatedText(TranslatedText[DisplayText.SELECT_STATE])
    );
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
          },
        },
        tableName
      )
    );
  };
  const onColumnResize = ({ end, columns }: GridColumnResizeEvent) => {
    hideColumnTitleOnResize();
    if (!end) { return false; }
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
    ({ dataState }: GridDataStateChangeEvent) =>  {
      tableCriteria.kendoConfig = JSON.stringify(dataState);
      setDataState(dataState);
      setFireAPI(true);
      // exportDataChanges &&
      //   exportDataChanges(
      //     process(gridData, {
      //       skip: 0,
      //       take: gridData.length,
      //       sort: dataState.sort,
      //       filter: dataState.filter,
      //     }).data
      //   );
      setKendoFilterStatus(JSON.stringify(dataState), tableCriteria);
      // if (!newDataState.total) {
      //   setNoDataMessage(<NoDataFound />);
      // }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
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
      title={getTranslatedText(column.title)}
      width={setColumnWidth(column.width as number, gridWidth)}
      minResizableWidth={200}
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
      filterCell={
        filterCellMapping[column.field]
          ? filterCellMapping[column.field]
          : undefined
      }
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
            <Grid container>
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


