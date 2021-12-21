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
  // setExpandedState,
  setGroupIds,
} from "@progress/kendo-react-data-tools";
import {
  Grid as Kgrid,
  GridColumn,
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridDataStateChangeEvent,
  GridExpandChangeEvent,
  GridNoRecords,
  // GridFilterCellProps,
  GridToolbar,
} from "@progress/kendo-react-grid";
import axios, { AxiosRequestConfig } from "axios";
import {
  cloneDeep,
  each,
  find,
  get,
  map, merge, omit, pick,
  set,
} from "lodash";
import { denormalize } from "normalizr";
import qs from "query-string";
import { default as React, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import { DropdownFilterCell } from "./column.filter.formatter/dropdown.filter.cell";
// import { AutoSizer } from "react-virtualized";
import { ReactComponent as ViewGridIcon } from "../../../assets/images/grid_view.svg";
import { ReactComponent as SolidIcon } from "../../../assets/images/view.svg";
import { ReactComponent as ViewChecked } from "../../../assets/images/view_checked.svg";
import apiClient from "../../../state/apiClient";
import { authActions } from "../../../state/ducks/auth";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import { getCellTemplate } from "../../components/common/kendo.column.templates/config";
import { toValidateIfDate } from "../../components/common/kendo.column.templates/helper";
import { ColumnMenu } from "../../components/common/kendo.column.templates/kendo.column.menu.templates/ColumnMenu";
import Loader from "../../components/common/kendo/Loader";
import KendoGlobalization from "../../components/KendoGlobalization";
import ClearFilters from "../../components/table/ClearFilters";
import Text from "../../components/Text";
import { canEditDocumentRevision } from "../../document.revision/utils/helpers";
import {
  documentEditPath,
  documentPreviewPath,
} from "../../document.revision/utils/paths";
import useDidMount from "../../hooks/useDidMount";
import GridStyles from "./styles";
import { KendoPanelProps } from "./types";

interface CreateExport {
  dynamicColumns?: any;
}
type Props<T> = KendoPanelProps<T> & CreateExport;
let call;

export function KendoGrid<T extends any>({
  dynamicColumns,
  tableName,
  providedData,
  queryUrl,
  normalizrSchema,
  tableCriteria,
  customDataSet,
}: Props<T>) {
  const dispatch = useDispatch();
  const didMount = useDidMount();
  const [isLoading, setIsLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  const { columnConfig, queryDict, forceUpdate, apiError, kendoConfig } = tableCriteria;
  const [collapsedState, setCollapsedState] = React.useState<string[]>([]);
  const queryData = providedData;
  const classes = GridStyles();
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

  const copyDynamicColumns = cloneDeep(dynamicColumns);
  const temp: any = [];
  let configColumns: any = [];
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
    "width",
    "locked",
    "cell",
    "format",
    "showColumnMenu",
    "columnMenu",
    "filterCell",
  ];
  copyDynamicColumns.forEach((o: any) => {
    temp.push(pick(o, list));
  });

  if (columnConfig) {
    const savedconfig = JSON.parse(columnConfig);
    savedconfig.forEach((o: any, i) => {
      configColumns.push(merge(temp[i], omit(o, omitList)));
    });
  } else {
    // Put Initial column configuration in store
    configColumns = configColumns.length === 0 ? temp : copyDynamicColumns;
  }

  const formatParams = () => {
    const params: any = {};
    if (!queryDict ) {
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
        // TODO: without this Date dropdown filter is not working
        each(data, (o, i) => {
          each(dynamicColumns, (k) => {
            const toCheckIfDate = toValidateIfDate(get(o, k.field));
            if (toCheckIfDate) {
              k.field = new Date(get(o, k.field));
            }
          });
        });
        const newDataState: any = processWithGroups(data, initialDataState);
        setDataState(initialDataState);
        setResultState(newDataState);
        setIsLoading(false);
        if (data.length === 0) {
          setNoDataMessage(
            <Typography>
              <Text translation="table.no.results.found"></Text>
            </Typography>
          );
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
  }, [queryDict, didMount, tableName]);

  useEffect(() => {
    if (forceUpdate) {
      queryApi();
    }
  }, [forceUpdate]);

  const kendoConfigFromState = kendoConfig;
  const initialDataState: State = kendoConfigFromState
    ? JSON.parse(kendoConfigFromState)
    : { skip: 0, take: 25, group: [] };
  const processWithGroups = (data: any, dataState: State) => {
    const cloneDeepDataState = cloneDeep(dataState);
    const newDataState = process(data, cloneDeepDataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };
  const [dataState, setDataState] = React.useState<State>(initialDataState);
  const [resultState, setResultState] = React.useState<DataResult>(
    processWithGroups(queryData, initialDataState)
  );
  const onExpandChange = React.useCallback(
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
  // check if document is editable or readonly
  const canEdit = (data: DocumentRevision) => canEditDocumentRevision(data);
  // On Grid Row click
  const onRowClick = (rowData) => {
    let urlPath = documentPreviewPath(
      rowData.dataItem.id,
      rowData.dataItem.document.id
    );
    if (canEdit(rowData.dataItem)) {
      urlPath = documentEditPath(
        rowData.dataItem.id,
        rowData.dataItem.document.id
      );
    }
    window.open(urlPath, "_self");
  };
  const onDataStateChange = React.useCallback(
    (event: GridDataStateChangeEvent) => {
      const newDataState = processWithGroups(queryData, event.dataState);
      tableCriteria.kendoConfig = JSON.stringify(event.dataState);
      tableCriteria.columnConfig = JSON.stringify(columnDefinitions);
      setDataState(event.dataState);
      setResultState(newDataState);
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
          },
          tableName
        )
      );
    },
    [queryData]
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [columnDefinitions, setColumnDefinitions] =
    React.useState(configColumns);
  useEffect(() => {
    setColumnDefinitions(configColumns);
  }, [tableName]);

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

  const getFilterCell = (fieldName: string) => {
    const foundObj = configColumns?.filter((data) => data.field === fieldName);
    return foundObj?.length ? foundObj[0].filterCell : undefined;
  };

  const renderColumns = () =>
    columnDefinitions.map((column, index) => {
      if (column.show) {
        return (
          <GridColumn
            key={index}
            field={column.field}
            width={column.width}
            locked={column.locked}
            title={
              column.title
                ? column.title
                  .replace(/[&\/\\#,()$~%.'":*?<>{}]/g, "")
                  .toUpperCase()
                : column.title
            }
            filter={column.filter}
            filterCell={getFilterCell(column.field)}
            cell={getCellTemplate(column.cell)}
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
        );
      }
    });

  const clearFilter = () => {
    if (
      dataState &&
      dataState.filter &&
      dataState.filter.filters &&
      dataState.filter.filters.length
    ) {
      dataState.filter.filters = [];
      const newDataState: any = processWithGroups(queryData, dataState);
      setDataState(dataState);
      setResultState(newDataState);
    }
  };

  const renderTable = () => (
    <>
      {isLoading && <Loader/>}
      <KendoGlobalization>
        <Kgrid
          className={classes.kGrid}
          data={resultState}
          sortable={true}
          filterable={true}
          reorderable={true}
          // TODO: Configuration
          pageable={{
            pageSizes: [25, 50, 100, 250, 500, 1000],
            buttonCount: 4,
          }}
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
              <Grid item>
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
                    {/* TODO: Add Column configuration */}
                    {configColumns.map((item: any) =>
                      item.field !== "docID" ? (
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
              </Grid>
            </Grid>
          </GridToolbar>
          {renderColumns()}
          <GridNoRecords>{noDataMessage}</GridNoRecords>
        </Kgrid>
      </KendoGlobalization>
    </>
  );
  return (
    <Box>
      <div style={{ color: "red" }}>{apiError}</div>
      {renderTable()}
    </Box>
  );
}
