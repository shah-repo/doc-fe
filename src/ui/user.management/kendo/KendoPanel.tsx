import { Box, Grid } from "@material-ui/core";
import { DataResult, process, State } from "@progress/kendo-data-query";
import {
  setExpandedState,
  setGroupIds,
} from "@progress/kendo-react-data-tools";
import {
  Grid as KendoGrid,
  GridCellProps,
  GridColumn,
  GridColumnMenuGroup,
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridDataStateChangeEvent,
  GridExpandChangeEvent, GridFilterCellProps, GridNoRecords, GridToolbar,
} from "@progress/kendo-react-grid";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { find, isEmpty, map, sortBy, startCase } from "lodash";
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import * as generateUuid from "uuid/v4";
import apiClient from "../../../state/apiClient";
import { authActions } from "../../../state/ducks/auth";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { userManagementActions, userManagementSelectors } from "../../../state/ducks/userManagement";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement/types";
import { AsyncActionErrorResponse } from "../../../state/middlewares/api/types";
import { store } from "../../../state/store";
import { ActiveDropdown } from "../../components/common/kendo.column.templates/ActiveDropdown";
import CellRender from "../../components/common/kendo.column.templates/CellRender";
import { DropdownFilterTemplate } from "../../components/common/kendo.column.templates/DropdownFilterTemplate";
import ColumnHeader from "../../components/common/kendo/ColumnHeader";
import { DisplayText, hideColumnTitleOnResize, TranslatedText } from "../../components/common/kendo/helpers";
import Loader from "../../components/common/kendo/Loader";
import NoDataFound from "../../components/common/kendo/NoDataFound";
import { KendoColumn } from "../../components/common/kendo/types";
import KendoGlobalization from "../../components/KendoGlobalization";
import { toastError } from "../../components/notifications";
import ClearFilters from "../../components/table/ClearFilters";
import GridTitle from "../../document.revision/grid/GridTitle/presenter";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDidMount from "../../hooks/useDidMount";
import AddEmployeeContainer from "../add.employee/container";
import EnableDropboxButton from "../EnableDropboxButton/EnableDropboxButton";
import { CommandCell } from "./cell.template/CommandCell";
import { DropdownFilterCell } from "./cell.template/DropdownFilterCell";
import { EmailCell } from "./cell.template/EmailCell";
import { GroupDropdown } from "./cell.template/GroupDropdown";
import { GroupsCell } from "./cell.template/GroupsCell";
import { NameCell } from "./cell.template/NameCell";
import { SignedCell } from "./cell.template/SignedCell";
import KendoGridStyles from "./styles";
import { AddUserManage, UserManage, UserManagementProps } from "./types";

let call: CancelTokenSource;

export function KendoPanel<T>({
  gridConfiguration = { columns: [], pagerSettings: {}, groupableFields: [] },
  tableName,
  gridData,
  tableCriteria,
  queryUrl = "",
  onSelect,
  hasDropboxPermission,
  dropboxAsync,
  enableDropboxAction,
  isCompanyDropboxEnabled,
}: UserManagementProps<Partial<GetEmployeeResponse>>) {
  const intl = useIntl();
  const getTranslatedText = (key: string) => key ? intl.formatMessage({ id: key }) : "";
  const editField = getTranslatedText(TranslatedText[DisplayText.INEDIT]);
  const didMount = useDidMount();
  const dispatch = useDispatch();
  const classes = KendoGridStyles();
  const { columnConfig, kendoConfig } = tableCriteria;
  if (columnConfig && JSON.parse(columnConfig).length) {
    gridConfiguration.columns = JSON.parse(columnConfig);
  }
  const [columnDefinitions, setColumnDefinitions] = useState<KendoColumn[]>(
    gridConfiguration.columns
  );
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
  const processWithGroups = (data: Partial<GetEmployeeResponse>[], dataState: State) => {
    const newDataState = process(data, dataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };

  const edit = (dataItem: GetEmployeeResponse) => {
    onSelect && onSelect({ dataItem })();
  };

  const add = ({ inEdit, id, name, email, groups, isNewRecord }: UserManage) => {
    inEdit = true;
    isNewRecord = true;
    const payload = {
      user: {
        id,
        name,
        email,
      },
      groups,
    };
    handleCreate(payload);
  };
  const addEmployeeAction = useActionCreator(userManagementActions.addEmployee);

  const async = useAsync({
    onSuccess: () => {
      queryApi();
    },
    onError: (error) => {
      setIsLoading(false);
      toastError(error as string);
    },
  });

  const handleCreate = (values: AddUserManage) => {
    setIsLoading(true);
    async.start(addEmployeeAction, values, async);
  };

  const cancel = () => {
    gridData.splice(0, 1);
    const newDataState = processWithGroups(gridData, dataState);
    setResultState(newDataState);
  };

  let initialDataState: State;

  if (kendoConfig) {
    initialDataState = JSON.parse(kendoConfig);
  } else  {
    initialDataState = {
      filter:
        {
          logic: "and",
          filters: [{ field: "active", operator: "eq", value: true }],
        },
      skip: 0,
      take: 25,
      group: [],
      sort: [],
    };
  }

  const setSearchStatus = (reset: boolean) => {
    dataState.filter = {
      logic: "and",
      filters: [],
    };
    if (reset) {
      dataState.group = [];
      dataState.sort = [];
      dataState.skip = 0;
      dataState.take = 25;
    }
    setDataState(dataState);
    const newDataState = processWithGroups(gridData, dataState);
    setResultState(newDataState);
    tableCriteria.kendoConfig = JSON.stringify(dataState);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          columnConfig: JSON.stringify(gridConfiguration.columns),
          queryDict: {},
        },
        tableName
      )
    );
  };
  const setKendoFilterStatus = (
    kendoConfig: string,
  ): void => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          kendoConfig,
          queryDict: {},
        },
        tableName
      )
    );
  };
  const [isLoading, setIsLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  const [fireAPI, setFireAPI] = useState(true);
  const [dataState, setDataState] = useState<State>(initialDataState);
  const [collapsedState, setCollapsedState] = useState<string[]>([]);
  const [resultState, setResultState] = useState<DataResult>(
    processWithGroups(gridData, initialDataState)
  );
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableCriteria.kendoConfig, didMount, tableCriteria.forceUpdate]);

  const queryApi = () => {
    call?.cancel();
    call = axios.CancelToken.source();
    const requestConfig: AxiosRequestConfig = {
      method: "get",
      url: queryUrl,
      params: {},
      paramsSerializer: (params) => qs.stringify(params),
      headers: {},
      cancelToken: call.token,
    };
    requestConfig.headers.Authorization = `bearer ${
      store.getState().auth.user.employeeId
    }:${store.getState().auth.user.sessionId}`;
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
        data = data.map((el) => ({
          ...el,
          groupsOrg: el.groups,
          groups: el.groups
            .map((e: { name: string }) => e.name.trimLeft().trimEnd())
            .sort()
            .join(", "),
          status: el?.user?.confirmed && !el?.user?.locked
            ? getTranslatedText("user.management.signed.up")
            : el?.user?.locked ? getTranslatedText("reset.password") :
              getTranslatedText("user.management.resend.signup.email"),
        }));
        const newDataState = processWithGroups(data, initialDataState);
        setDataState(initialDataState);
        setResultState(newDataState);
        if (newDataState.total === 0) {
          setNoDataMessage(<NoDataFound />);
        }
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

  const result = setExpandedState({
    data: resultState.data,
    collapsedIds: collapsedState,
  });
  const onDataStateChange = useCallback(
    ({ dataState }: GridDataStateChangeEvent) => {
      const newDataState = processWithGroups(gridData, dataState);
      tableCriteria.kendoConfig = JSON.stringify(dataState);
      setDataState(dataState);
      setResultState(newDataState);
      setKendoFilterStatus(JSON.stringify(dataState));
      if (!newDataState.total) {
        setNoDataMessage(<NoDataFound />);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridData]
  );
  const onExpandChange = useCallback(
    ({ value, dataItem }: GridExpandChangeEvent) => {
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
  const clearFilter = () => setSearchStatus(false);

  const commandCell = (props: GridCellProps) =>
    <CommandCell
      {...props}
      edit={edit}
      add={add}
      cancel={cancel}
      editField={editField}
    />
  ;

  const BooleanFilterCell = (props: GridFilterCellProps) => (
    <DropdownFilterTemplate
      {...props}
      data={[{
        text: getTranslatedText(TranslatedText[DisplayText.ACTIVE]),
        value: true,
      }, {
        text: getTranslatedText(TranslatedText[DisplayText.INACTIVE]),
        value: false,
      }]}
      defaultItem={{
        text: getTranslatedText(TranslatedText[DisplayText.ALL]),
        value: getTranslatedText(TranslatedText[DisplayText.ALL]),
      }}
    />
  );

  const SignUpFilterCell = (props: GridFilterCellProps) => (
    <DropdownFilterCell
      {...props}
      data={[
        getTranslatedText(TranslatedText[DisplayText.SIGNEDUP]),
        getTranslatedText(TranslatedText[DisplayText.RESEND_SIGNUP_EMAIL]),
        getTranslatedText(TranslatedText[DisplayText.RESET_PASSWORD]),
      ]}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.ALL],
      })}
    />
  );

  const filterCellMapping = {
    groups: GroupDropdown,
    active: BooleanFilterCell,
    status: SignUpFilterCell,
  };

  const fieldToCellMapping = {
    "user.name": NameCell,
    "user.email": EmailCell,
    "groups": GroupsCell,
    "active": ActiveDropdown,
    "status": SignedCell,
    "": commandCell,
  };

  const columnRenderer = () => (
    sortBy(columnDefinitions, ["orderIndex"]).map((column, idx) => (
      <GridColumn
        key={idx}
        {...column}
        title={startCase(getTranslatedText(column.title))}
        minResizableWidth={100}
        cell={fieldToCellMapping[column.field]
          ? fieldToCellMapping[column.field] : undefined}
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
              <GridColumnMenuGroup {...props} />
            )
            : undefined
        }
      />
    )));

  const columnResize = ({ columns, end }: GridColumnResizeEvent) => {
    hideColumnTitleOnResize();
    if (!end) { return false; }
    let dataColumns: KendoColumn[] = gridConfiguration.columns;
    dataColumns = map(dataColumns, (column: KendoColumn) => {
      const columnObject = find(columns, { field: column.field });
      column.width = columnObject?.width;
      return column;
    });
    setTimeout(() => {
      setColumnDefinitions(dataColumns);
      updateDataColumnsState(dataColumns);
    }, 100);
  };

  const columnReorder = ({ columns }: GridColumnReorderEvent) => {
    let dataColumns: KendoColumn[] = gridConfiguration.columns;
    dataColumns = map(dataColumns, (column: KendoColumn) => {
      const columnObject = find(columns, { field: column.field });
      column.orderIndex = columnObject?.orderIndex;
      return column;
    });
    setColumnDefinitions(dataColumns);
    updateDataColumnsState(dataColumns);
  };

  const defaultGroups = useSelector(userManagementSelectors.getDefaultGroups);

  const addNew = () => {
    setSearchStatus(true);
    const newDataItem = {
      id: generateUuid(),
      inEdit: true,
      isNewRecord: true,
      active: true,
      groups: defaultGroups.map((el) => ({ id: el.value })) as [],
    };
    gridData.unshift(newDataItem);
    setResultState(processWithGroups(gridData, dataState));
  };

  const tableRenderer = () => (
    <>
      <KendoGlobalization>
        <KendoGrid
          className={`${classes.kGrid} no-row-pointer`}
          data={result}
          total={resultState.total}
          pageable={gridConfiguration.pagerSettings}
          sortable={true}
          filterable={true}
          reorderable={true}
          resizable={true}
          groupable={true}
          cellRender={CellRender}
          onDataStateChange={onDataStateChange}
          {...dataState}
          onExpandChange={onExpandChange}
          expandField="expanded"
          onColumnResize={columnResize}
          onColumnReorder={columnReorder}
        >
          <GridToolbar>
            <Grid
              container
              spacing={1}
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <ClearFilters {...{ clearFilter }} />
              </Grid>
            </Grid>
          </GridToolbar>
          {columnRenderer()}
          <GridNoRecords>{noDataMessage}</GridNoRecords>
        </KendoGrid>
      </KendoGlobalization>
      {isLoading && <Loader/>}
    </>
  );
  return (
    <Box>
      <Box mb={2}>
        <Grid container justify="space-between" alignItems="center">
          <GridTitle translation="navigation.user.management" />
          <Grid item className={classes.dropboxButton}>
            <EnableDropboxButton
              shouldDisplayButton={hasDropboxPermission}
              {...{ dropboxAsync, enableDropboxAction }}
              disabled={Boolean(isCompanyDropboxEnabled)}
            />
            <AddEmployeeContainer addGroup={addNew} />
          </Grid>
        </Grid>
      </Box>
      <Grid item xs>
        <div className={classes.errorClass}>{tableCriteria.apiError}</div>
        {tableRenderer()}
      </Grid>
    </Box>
  );
}
