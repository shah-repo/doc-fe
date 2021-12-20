/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Dialog,
  FormControl,
  Grid,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import {
  DataResult,
  orderBy,
  process,
  State,
} from "@progress/kendo-data-query";
import {
  // setExpandedState,
  setGroupIds,
} from "@progress/kendo-react-data-tools";
import {
  Grid as KendoGrid,
  GridColumn,
  GridColumnReorderEvent,
  GridColumnResizeEvent,
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
import { useDispatch } from "react-redux";
import { ReactComponent as ViewGridIcon } from "../../../assets/images/grid_view.svg";
import { ReactComponent as SolidIcon } from "../../../assets/images/view.svg";
import { ReactComponent as ViewChecked } from "../../../assets/images/view_checked.svg";
import apiClient from "../../../state/apiClient";
import { authActions } from "../../../state/ducks/auth";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import {
  DEFAULT_TRAINING_RECORD_QUERY,
  TrainingRecordQuery,
} from "../../../state/ducks/training/types";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import { getCellTemplate } from "../../components/common/kendo.column.templates/config";
import { ColumnMenu } from "../../components/common/kendo.column.templates/kendo.column.menu.templates/ColumnMenu";
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
import { DropdownFilterTemplate } from "./filter.template/DropdownFilterTemplate";
import KendoGridStyles from "./styles";
import { KendoPanelProps } from "./types";

type Props<T> = KendoPanelProps<T>;

let call: CancelTokenSource;

export function KendoPanel<T extends any>({
  columns, // its grid configuration
  queryUrl = "",
  data,
  tableName,
  tableCriteria,
  rootCustomStyle,
  normalizrSchema,
}: Props<T>) {
  const trainingDetailsDialog = useDialog();
  const [training, setTraining] = useState<TrainingRecordQuery>(
    DEFAULT_TRAINING_RECORD_QUERY
  );
  const didMount = useDidMount();
  const classes = KendoGridStyles();
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
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [noDataMessage, setNoDataMessage] = useState(<span />);

  const kendoConfigColumn = tableCriteria.columnConfig;
  const gridConfiguration = columns;
  const initialGridConfiguration: { columns: any[] } = { ...gridConfiguration };
  // Check if the Column config available in State, if so prefer what is available in State
  if (kendoConfigColumn && JSON.parse(kendoConfigColumn).length) {
    gridConfiguration.columns = JSON.parse(kendoConfigColumn);
  }
  const [columnDefinitions, setColumnDefinitions] = React.useState(
    gridConfiguration.columns
  );
  const defaultItem = {
    text: "Select Item",
    value: "",
  };

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
            ...map(columns.columns, "field"),
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
  // Kendo Loader
  const loadingPanel = isLoading && (
    <div className={`k-loading-mask ${classes.loading}`}>
      <div className="k-loading-image"></div>
      <div className="k-loading-color"></div>
    </div>
  );

  // Check if the Kendo config is available in state, if not set the default config
  const kendoConfigFromState = tableCriteria.kendoConfig;
  const dropdownFilterState = tableCriteria.queryDict
    ? tableCriteria.queryDict
    : {};

  const initialKendoConfig: State = kendoConfigFromState
    ? JSON.parse(kendoConfigFromState)
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

  const initialDropdownConfig =
    dropdownFilterState["trainingPlan.createdAt"] || defaultItem;
  const initialDueDateSelectedOption = dropdownFilterState.dueOn || defaultItem;
  const initialCompletedOnSelectedOption =
    dropdownFilterState.completedAt || defaultItem;

  const processWithGroups = (data: any[], dataState: State) => {
    const cloneDeepDataState = cloneDeep(dataState);
    const newDataState = process(data, cloneDeepDataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };

  const [defaultTrainingItem, setDefaultTrainingItem] = React.useState(
    initialDropdownConfig
  );

  const [dueDateSelectedOption, setDueDateSelectedOption] = React.useState(
    initialDueDateSelectedOption
  );

  const [completedOnSelectedOption, setCompletedOnSelectedOption] =
    React.useState(initialCompletedOnSelectedOption);
  const [dataState, setDataState] = useState<State>(initialKendoConfig);
  const [collapsedState, setCollapsedState] = useState<string[]>([]);
  const [resultState, setResultState] = useState<DataResult>(
    processWithGroups(data, initialKendoConfig)
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

  const setKendoDropdownFilter = (dropdownConfig: any) => {
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

  const [fireAPI, setFireAPI] = useState(true);
  const onDataStateChange = useCallback(
    (event: any) => {
      const newDataState = processWithGroups(data, event.dataState);
      tableCriteria.kendoConfig = JSON.stringify(event.dataState);
      setDataState(event.dataState);
      setResultState(newDataState);
      setKendoFilterStatus(tableCriteria);
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

  // On Grid Row click
  const onRowClick = (rowData: any) => {
    trainingDetailsDialog.open();
    setTraining(rowData.dataItem);
  };

  const setSearchStatus = (state?: any, isClearAll?: boolean) => {
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

  // Clear Filter Button Click
  const clearFilter = () => setSearchStatus(undefined, true);

  const onChange = (item: any) => {
    const dataColumns = [...columnDefinitions];
    dataColumns.forEach((c) => {
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

  const onStateChange = (setDefault) => {
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
  const AssignedDateFilterTemplate: any = (props: GridFilterCellProps) => (
    <DropdownFilterTemplate
      {...props}
      data={documentRevisionEffectiveDateOption()}
      defaultItem={defaultTrainingItem}
      onStateChange={onStateChange}
      defaultValue={defaultTrainingItem}
      operator={"gt"}
    />
  );

  const DueDateFilterTemplate: any = (props: GridFilterCellProps) => (
    <DropdownFilterTemplate
      {...props}
      data={dueDateOption()}
      defaultItem={dueDateSelectedOption}
      defaultValue={dueDateSelectedOption}
      onStateChange={onStateChange}
      operator={"gt"}
    />
  );

  const CompletedOnFilterTemplate: any = (props: GridFilterCellProps) => (
    <DropdownFilterTemplate
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

  const columnRenderer = (column: any, index: React.Key | undefined) => (
    <GridColumn
      key={index}
      field={column.field}
      title={column.title}
      cell={getCellTemplate(column.cell)}
      filter={column.filter}
      width={column.width}
      orderIndex={column.orderIndex}
      locked={column.locked}
      groupable={column.groupable}
      reorderable={column.reorderable}
      sortable={column.sortable}
      filterCell={column.field && filterCellMapping(column.field)}
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const sortedColumnDefinitions: any[] = orderBy(
    [...columnDefinitions],
    [{ field: "locked", dir: "desc" }]
  );
  sortedColumnDefinitions.forEach((data) => {
    const stateFilerObject =
      initialGridConfiguration &&
      find(initialGridConfiguration?.columns, { field: data.field });
    data.reorderable = !data.locked;
    data.sortable = !data.locked;
    data.orderIndex = data.locked ? 0 : data.orderIndex;
    data.groupable = data.locked ? !data.locked : stateFilerObject?.groupable;
  });
  const renderKendoGrid = () => (
    <>
      <KendoGlobalization>
        <KendoGrid
          className={classes.kGrid}
          data={resultState}
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
                      item.field !== "crId" ? (
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
          <GridNoRecords>{noDataMessage}</GridNoRecords>
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
