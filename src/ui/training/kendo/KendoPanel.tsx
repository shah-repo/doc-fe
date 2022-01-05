/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Dialog, Grid, Typography,
} from "@material-ui/core";
import {
  DataResult, process,
  State,
} from "@progress/kendo-data-query";
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
  GridToolbar,
} from "@progress/kendo-react-grid";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { cloneDeep, find, isEmpty, map, pick } from "lodash";
import moment from "moment";
import "moment-timezone";
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { AutoSizer, Size } from "react-virtualized";
import apiClient from "../../../state/apiClient";
import { authActions } from "../../../state/ducks/auth";
import { ChangeRequestStatus } from "../../../state/ducks/changeRequest/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import {
  DEFAULT_TRAINING_RECORD_QUERY,
  TrainingRecordQuery,
} from "../../../state/ducks/training/types";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import { cellTemplateMapping } from "../../components/common/kendo.column.templates/config";
import { DateDropdownFilterCell } from "../../components/common/kendo.column.templates/DateDropdownFilterCell";
import { ColumnMenu } from "../../components/common/kendo.column.templates/kendo.column.menu.templates/ColumnMenu";
import ColumnHeader from "../../components/common/kendo/ColumnHeader";
import ColumnShowHideMenu from "../../components/common/kendo/ColumnShowHideMenu";
import { DisplayText, hideColumnTitleOnResize, orderByLockedState, setColumnWidth, TranslatedText } from "../../components/common/kendo/helpers";
import Loader from "../../components/common/kendo/Loader";
import { DropdownFilterDefaultItem, KendoColumn, KendoPanelProps } from "../../components/common/kendo/types";
import KendoGlobalization from "../../components/KendoGlobalization";
import ClearFilters from "../../components/table/ClearFilters";
import { TablePanelStateProps } from "../../components/table/types";
import Text from "../../components/Text";
import {
  documentRevisionEffectiveDateOption,
  dueDateOption,
  trainingCompletedOnDateOption,
} from "../../document.revision/utils/helpers";
import useDialog from "../../hooks/useDialog";
import useDidMount from "../../hooks/useDidMount";
import TrainingDetails from "../details/TrainingDetails";
import KendoGridStyles from "./styles";
import { DroDownFilterChangeProps } from "./types";

type Props<T> = KendoPanelProps<T>;

let call: CancelTokenSource;

export function KendoPanel<T extends any>({
  gridConfiguration = { columns: [], pagerSettings: {}, groupableFields: [] },
  queryUrl = "",
  gridData,
  tableName,
  tableCriteria,
  rootCustomStyle,
  normalizrSchema,
}: Props<T>) {
  const intl = useIntl();
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
  const [columnDefinitions, setColumnDefinitions] = React.useState(gridConfiguration.columns);

  const initialKendoConfig: State = kendoConfig
    ? JSON.parse(kendoConfig)
    : {
      skip: 0,
      take: 25,
      group: [],
      sort: [{ field: "document.trId", dir: "asc" }],
      // Initial filter descriptor
      filter: {
        logic: "and",
        filters: [],
      },
    };
  const [dataState, setDataState] = useState<State>(initialKendoConfig);
  const [collapsedState, setCollapsedState] = useState<string[]>([]);
  const [noDataMessage, setNoDataMessage] = useState(<span />);

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
  }, [
    tableCriteria.kendoConfig,
    didMount,
    tableCriteria.forceUpdate,
    tableCriteria.queryDict,
  ]);

  const formatParams = () => {
    const params: any = {};

    if (
      defaultTrainingItem?.field === "trainingPlan.createdAt" &&
      defaultTrainingItem?.value
    ) {
      params.createdAtAfter = defaultTrainingItem.value;
    }
    if (
      dueDateSelectedOption?.field === "dueOn" &&
      dueDateSelectedOption?.text === "Due in 7 days"
    ) {
      params.dueOnAfter = moment().toISOString();
      params.dueOnBefore = dueDateSelectedOption.value;
      params.isCompleted = false;
    }
    if (
      dueDateSelectedOption?.field === "dueOn" &&
      dueDateSelectedOption?.text === "Overdue"
    ) {
      params.dueOnBefore = moment().toISOString();
      params.isCompleted = false;
    }

    if (
      completedOnSelectedOption?.field === "completedAt" &&
      completedOnSelectedOption?.value
    ) {
      params.completedAtAfter = completedOnSelectedOption.value;
    }

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
    dispatch(tableSearchActions.setData([], tableName));

    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          apiError: "",
          scrollToIndex: 0,
          forceUpdate: false,
          kendoConfig: JSON.stringify(initialKendoConfig),
          columnConfig: JSON.stringify(columnDefinitions),
        },
        tableName
      )
    );

    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        data.forEach((el) => {
          el.trainingPlan.curriculumDocIds = Array.isArray(
            el.trainingPlan.curriculumDocIds
          )
            ? el.trainingPlan.curriculumDocIds.join(", ")
            : "";
        });
        const newDataState: any = processWithGroups(data, dataState);
        setDataState(dataState);
        setResultState(newDataState);
        if (data.length === 0) {
          setNoDataMessage(
            <Typography>
              <Text translation="table.no.results.found"></Text>
            </Typography>
          );
        }
        data = map(data, (record) =>
          pick(record, [
            ...map(gridConfiguration.columns, "field"),
            "id",
            "trId",
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
              columnConfig: JSON.stringify(columnDefinitions),
            },
            tableName
          )
        );
      });
  };

  // Kendo Helper Methods
  const processWithGroups = (data: T[], dataState: State) => {
    const cloneDeepDataState = cloneDeep(dataState);
    const newDataState = process(data, cloneDeepDataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };
  const [resultState, setResultState] = useState<DataResult>(
    processWithGroups(gridData, initialKendoConfig)
  );
  const result = setExpandedState({
    data: resultState.data,
    collapsedIds: collapsedState,
  });
  const trainingDetailsDialog = useDialog();
  const [training, setTraining] = useState<TrainingRecordQuery>(
    DEFAULT_TRAINING_RECORD_QUERY
  );
  const setKendoFilterStatus = (
    tableCriteria: Partial<TablePanelStateProps>
  ): void => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
        },
        tableName
      )
    );
  };

  // Kendo Grid Actions Methods
  const onStateChange = (setDefault: DroDownFilterChangeProps) => {
    const updatedFilter = {
      ...setDefault.selectedItem,
      field: setDefault.parentField,
    };
    if (setDefault.parentField === "trainingPlan.createdAt") {
      setDefaultTrainingItem(updatedFilter);
    } else if (setDefault.parentField === "dueOn") {
      setDueDateSelectedOption(updatedFilter);
    } else if (setDefault.parentField === "completedAt") {
      setCompletedOnSelectedOption(updatedFilter);
    }
    setKendoDropdownFilter(updatedFilter);
    setFireAPI(true);
  };
  const setSearchStatus = (state?: ChangeRequestStatus | undefined, isClearAll?: boolean) => {
    dataState.filter = {
      logic: "and",
      filters: state && !isClearAll ? [] : [],
    };
    if (isClearAll) {
      setDueDateSelectedOption(defaultItem);
      setCompletedOnSelectedOption(defaultItem);
      setDefaultTrainingItem(defaultItem);
      setFireAPI(true);
    }
    setDataState(dataState);
    tableCriteria.kendoConfig = JSON.stringify(dataState);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: isClearAll ? {} : {},
        },
        tableName
      )
    );
  };
  const onColumnResize = (event: GridColumnResizeEvent) => {
    if (event.end) {
      let dataColumns = columnDefinitions;
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
    let dataColumns = columnDefinitions;
    dataColumns = map(dataColumns, (column) => {
      const columnObject = find(event.columns, { field: column.field });
      column.orderIndex = columnObject?.orderIndex;
      return column;
    });
    setColumnDefinitions(dataColumns);
    updateDataColumnsState(dataColumns);
  };
  const onRowClick = (rowData: { dataItem: TrainingRecordQuery }) => {
    trainingDetailsDialog.open();
    setTraining(rowData.dataItem);
  };
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

  // On Show / Hide Column From Main Menu
  const onColumnShowHide = (item: KendoColumn) => {
    const dataColumns = map(columnDefinitions, (column) => {
      if (column.field === item.field) {
        column.show = !column.show;
      }
      return column;
    });
    setColumnDefinitions(dataColumns);
    updateDataColumnsState(dataColumns);
  };

  const defaultItem: DropdownFilterDefaultItem = {
    text: intl.formatMessage({ id: TranslatedText[DisplayText.SELECT_ITEM] }),
    value: "",
  };

  // Check if the Kendo config is available in state, if not set the default config
  const dropdownFilterState = tableCriteria.queryDict
    ? tableCriteria.queryDict
    : {};

  const initialDropdownConfig =
    dropdownFilterState["trainingPlan.createdAt"] || defaultItem;
  const initialDueDateSelectedOption = dropdownFilterState.dueOn || defaultItem;
  const initialCompletedOnSelectedOption =
    dropdownFilterState.completedAt || defaultItem;


  const [defaultTrainingItem, setDefaultTrainingItem] = React.useState(
    initialDropdownConfig
  );

  const [dueDateSelectedOption, setDueDateSelectedOption] = React.useState(
    initialDueDateSelectedOption
  );

  const [completedOnSelectedOption, setCompletedOnSelectedOption] =
    React.useState(initialCompletedOnSelectedOption);


  const setKendoDropdownFilter = (dropdownConfig) => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {
            ...tableCriteria.queryDict,
            [dropdownConfig.field]: dropdownConfig,
          },
        },
        tableName
      )
    );
  };

  // Clear Filter Button Click
  const clearFilter = () => setSearchStatus(undefined, true);

  const AssignedDateFilterTemplate: any = (props: GridFilterCellProps) => (
    <DateDropdownFilterCell
      {...props}
      data={documentRevisionEffectiveDateOption()}
      defaultItem={defaultTrainingItem}
      onStateChange={onStateChange}
      defaultValue={defaultTrainingItem}
      operator={"gt"}
    />
  );

  const DueDateFilterTemplate: any = (props: GridFilterCellProps) => (
    <DateDropdownFilterCell
      {...props}
      data={dueDateOption()}
      defaultItem={dueDateSelectedOption}
      defaultValue={dueDateSelectedOption}
      onStateChange={onStateChange}
      operator={"gt"}
    />
  );

  const CompletedOnFilterTemplate: any = (props: GridFilterCellProps) => (
    <DateDropdownFilterCell
      {...props}
      data={trainingCompletedOnDateOption()}
      defaultItem={completedOnSelectedOption}
      onStateChange={onStateChange}
      defaultValue={completedOnSelectedOption}
      operator={"gt"}
    />
  );

  const filterCellMapping = (field: string) => {
    switch (field) {
      case "trainingPlan.createdAt":
        return AssignedDateFilterTemplate;
      case "dueOn":
        return DueDateFilterTemplate;
      case "completedAt":
        return CompletedOnFilterTemplate;
      default:
        return null;
    }
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
      cell={cellTemplateMapping[column.cell]}
      width={setColumnWidth(column.width as number, gridWidth)}
      minResizableWidth={100}
      filterCell={column.field && filterCellMapping(column.field)}
      headerCell={
        column.title ? (props) => <ColumnHeader data={props} /> : undefined
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
                {trainingDetailsDialog.isOpen && (
                  <Dialog
                    open={trainingDetailsDialog.isOpen}
                    classes={{ paper: classes.dialogContent }}
                    fullWidth
                    maxWidth="md"
                  >
                    <TrainingDetails
                      dialog={trainingDetailsDialog}
                      training={training}
                    />
                  </Dialog>
                )}
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
