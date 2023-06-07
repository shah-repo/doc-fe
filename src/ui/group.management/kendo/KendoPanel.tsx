/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid } from '@material-ui/core';
import { DataResult, State, process } from '@progress/kendo-data-query';
import {
  setExpandedState,
  setGroupIds,
} from '@progress/kendo-react-data-tools';
import {
  GridCellProps,
  GridColumn,
  GridColumnMenuGroup,
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridDataStateChangeEvent,
  GridExpandChangeEvent,
  GridFilterCellProps,
  GridNoRecords,
  GridRowClickEvent,
  GridToolbar,
} from '@progress/kendo-react-grid';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { find, flatMap, isEmpty, map, set, sortBy, startCase } from 'lodash';
import qs from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { AutoSizer, Size } from 'react-virtualized';
import apiClient from '../../../state/apiClient';
import { authActions } from '../../../state/ducks/auth';
import { groupManagementActions } from '../../../state/ducks/groupManagement';
import { GroupRequestBody } from '../../../state/ducks/groupManagement/types';
import { tableSearchActions } from '../../../state/ducks/tableSearch';
import { userManagementActions } from '../../../state/ducks/userManagement';
import {
  GetEmployeeResponse,
  LoadCompanyGroup,
} from '../../../state/ducks/userManagement/types';
import { AsyncActionErrorResponse } from '../../../state/middlewares/api/types';
import { store } from '../../../state/store';
import GridTitle from '../../components/KendoGrid/GridTitle/presenter';
import KendoGridStyles from '../../components/KendoGrid/KendoGrid.styles';
import StyledKendoGrid from '../../components/StyledKendoGrid/StyledKendoGrid';
import CellRender from '../../components/common/kendo.column.templates/CellRender';
import { DropdownFilterTemplate } from '../../components/common/kendo.column.templates/DropdownFilterTemplate';
import ColumnHeader from '../../components/common/kendo/ColumnHeader';
import Loader from '../../components/common/kendo/Loader';
import NoDataFound from '../../components/common/kendo/NoDataFound';
import { DisplayText, TranslatedText, hideColumnTitleOnResize, hideOperatorTooltip, setColumnWidth } from '../../components/common/kendo/helpers';
import { KendoColumn, KendoPanelProps } from '../../components/common/kendo/types';
import { toastError } from '../../components/notifications';
import ClearFilters from '../../components/table/ClearFilters';
import {
  TablePanelStateProps,
} from '../../components/table/types';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDidMount from '../../hooks/useDidMount';
import AddGroupContainer from '../add.group/AddGroup.container';
import { DEFAULT_ACTIVE_EMPLOYEES } from '../utils/types';
import GMExport from './GMExport';
import { CommandCell } from './cell.template/CommandCell';
import { EmployeesCell } from './cell.template/EmployeesCell';
import { GroupCell } from './cell.template/GroupCell';
import { NameCell } from './cell.template/NameCell';
import { ParentsCell } from './cell.template/ParentsCell';
import { PermissionsCell } from './cell.template/PermissionsCell';
import { TagsCell } from './cell.template/TagsCell';

interface GroupManagementProps {
  onSelect
  refreshTable: boolean
  canCreateGroups: boolean
}

let call: CancelTokenSource;

export function KendoPanel<T extends {id: string, inEdit?: boolean | string}>({
  gridConfiguration = { columns: [], pagerSettings: {}, groupableFields: [] },
  tableName,
  gridData,
  tableCriteria,
  queryUrl,
  onSelect,
  refreshTable,
  canCreateGroups,
}: KendoPanelProps<Partial<LoadCompanyGroup>> & GroupManagementProps) {
  const intl = useIntl();
  const getTranslatedText = (key: string) => key ? intl.formatMessage({ id: key }) : '';
  const didMount = useDidMount();
  const dispatch = useDispatch();
  const classes = KendoGridStyles();
  const [Official, setOfficial] = useState(false);
  const { columnConfig, kendoConfig } = tableCriteria;
  if (columnConfig && JSON.parse(columnConfig).length) {
    gridConfiguration.columns = JSON.parse(columnConfig);
  }
  const [columnDefinitions, setColumnDefinitions] = useState<KendoColumn[]>(
    gridConfiguration.columns,
  );
  const updateDataColumnsState = (dataColumns: KendoColumn[]) => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          columnConfig: JSON.stringify(dataColumns),
        },
        tableName,
      ),
    );
  };
  const processWithGroups = (data: Partial<LoadCompanyGroup>[], dataState: State) => {
    const newDataState = process(data, dataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };

  const edit = (dataItem: GridRowClickEvent) => {
    onSelect && onSelect({ dataItem })();
  };
  const addGroup = () => {
    setSearchStatus(true);
    const sampleData = {
      name: '',
      employees: [],
      parents: [],
      permissions: [],
      tags: [],
      isOfficial: Boolean(),
      inEdit: true,
    };
    gridData.unshift(sampleData);
    setResultState(processWithGroups(gridData, dataState));
  };
  const createGroupAsync = useAsync({
    onSuccess: () => {
      queryApi();
    },
    onError: (error) => {
      toastError(error as string);
    },
  });
  const handleCreate = (values: GroupRequestBody) => {
    dispatch(groupManagementActions.createGroup(values, createGroupAsync));
  };

  const update = ({
    name,
    employees,
    parents,
    permissions,
    tags,
  }: GroupRequestBody) => {
    const payload = {
      defaultForNewUsers: false,
      name,
      employees,
      isOfficial: Official,
      parents,
      permissions,
      tags,
    };
    handleCreate(payload);
  };

  let initialDataState: State;

  if (kendoConfig) {
    initialDataState = JSON.parse(kendoConfig);
  } else  {
    initialDataState = {
      filter:
        {
          logic: 'and',
          filters: [],
        },
      skip: 0,
      take: 25,
      group: [],
      sort: [],
    };
  }

  const setSearchStatus = (reset: boolean) => {
    dataState.filter = {
      logic: 'and',
      filters: [],
    };
    if (reset) {
      dataState.group = [];
      dataState.sort = [];
      dataState.skip = 0;
      dataState.take = 25;
    }
    setDataState(dataState);
    setResultState(processWithGroups(gridData, dataState));
    tableCriteria.kendoConfig = JSON.stringify(dataState);
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          columnConfig: JSON.stringify(gridConfiguration.columns),
          queryDict: {},
        },
        tableName,
      ),
    );
  };
  const setKendoFilterStatus = (
    tableCriteria: Partial<TablePanelStateProps>,
  ): void => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {},
        },
        tableName,
      ),
    );
  };
  const [isLoading, setIsLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState(<span />);
  const [fireAPI, setFireAPI] = useState(true);
  const [dataState, setDataState] = useState<State>(initialDataState); // Kendo Grid Data State
  const [collapsedState, setCollapsedState] = useState<string[]>([]);
  const [resultState, setResultState] = useState<DataResult>(
    processWithGroups(gridData, initialDataState),
  );
  // EMPLOYEES
  const [activeEmployees, setActiveEmployees] = useState<GetEmployeeResponse[]>(
    DEFAULT_ACTIVE_EMPLOYEES,
  );
  const getEmployeeAction = useActionCreator(userManagementActions.getEmployee);
  const asyncGetActiveEmployees = useAsync<GetEmployeeResponse[]>({
    onSuccess: (data: GetEmployeeResponse[] = []) => {
      setActiveEmployees(data);
    },
  });
  useEffect(() => {
    if (didMount) {
      asyncGetActiveEmployees.start(
        getEmployeeAction,
        { active: true },
        asyncGetActiveEmployees,
      );
    }
  }, [didMount]);
  useEffect(() => {
    if (didMount && refreshTable) {
      queryApi();
    }
  }, [refreshTable]);
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
  }, [tableCriteria.kendoConfig, didMount, tableCriteria.forceUpdate]);
  const formatParams = () => {
    const params: any = {};
    if (!tableCriteria.queryDict) {
      return;
    }
    Object.entries(tableCriteria.queryDict).forEach(([key, value]) => {
      if (key.startsWith('dynamicParams')) {
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
      method: 'get',
      url: queryUrl,
      params: formatParams(),
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
          apiError: '',
          scrollToIndex: 0,
          forceUpdate: false,
          kendoConfig: JSON.stringify(initialDataState),
          columnConfig: JSON.stringify(columnDefinitions),
        },
        tableName,
      ),
    );
    apiClient
      .request(requestConfig)
      .then((resp) => {
        resp.data = resp.data.map((el) => ({
          ...el,
          memberNames:
            el.employees.filter((e) => e.active)
              .map((e) => e.user.name.trimLeft().trimEnd())
              .sort()
              .join(', ') || '',
          parentName:
            el.parents
              .map((e) => e.name.trimLeft().trimEnd())
              .sort()
              .join(', ') || '',
          formattedTags: el?.tags?.sort().join(', ') || '',
          formattedPermissions: el?.permissions?.sort().join(', ') || '',
          groupType: el?.isOfficial
            ? getTranslatedText(TranslatedText[DisplayText.OFFICIAL])
            : getTranslatedText(TranslatedText[DisplayText.UNOFFICIAL]),
        }));
        return resp;
      })
      .then(({ data }) => {
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
        let responseMessage = '';
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
            ? message.join('; ')
            : message;
        }
        const errorMessage: string = responseMessage || exception.message;
        dispatch(
          tableSearchActions.setSearchCriteria(
            {
              queryDict: {},
              apiError: 'Error: ' + errorMessage,
              forceUpdate: false,
              kendoConfig: JSON.stringify(initialDataState),
              columnConfig: JSON.stringify(columnDefinitions),
            },
            tableName,
          ),
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
      setKendoFilterStatus(tableCriteria);
      if (!newDataState.total) {
        setNoDataMessage(<NoDataFound />);
      }
    },
    [gridData],
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
    [collapsedState],
  );
  const clearFilter = () => setSearchStatus(false);

  const commandCell = (props: GridCellProps) =>
    <CommandCell
      {...props}
      discard={discardEditMode}
      cancel={cancel}
      update={update}
      edit={edit}
    />
  ;

  const nameCell = (props: GridCellProps) =>
    <NameCell {...props} />;

  const employeeCell = (props: GridCellProps) =>
    <EmployeesCell {...props} employees={activeEmployees} />;

  const groupCell = (props: GridCellProps) =>
    <GroupCell {...props} isOfficial={Official} setOfficial={setOfficial} />;

  const tagCell = (props: GridCellProps) =>
    <TagsCell {...props} isOfficial={Official} />;

  const parentCell = (props: GridCellProps) =>
    <ParentsCell {...props} isOfficial={Official} />;

  const permissionCell = (props: GridCellProps) =>
    <PermissionsCell {...props} isOfficial={Official} />;

  const GroupTypeFilterCell = (props: GridFilterCellProps) => <DropdownFilterTemplate
    {...props}
    data={[{
      text: getTranslatedText(TranslatedText[DisplayText.OFFICIAL]),
      value: getTranslatedText(TranslatedText[DisplayText.OFFICIAL]),
    }, {
      text: getTranslatedText(TranslatedText[DisplayText.UNOFFICIAL]),
      value: getTranslatedText(TranslatedText[DisplayText.UNOFFICIAL]),
    }]}
    defaultItem={{
      text: getTranslatedText(TranslatedText[DisplayText.ALL]),
      value: getTranslatedText(TranslatedText[DisplayText.ALL]),
    }}
  />;

  const filterCellMapping = {
    groupType: GroupTypeFilterCell,
  };

  const fieldToCellMapping = {
    'memberNames': employeeCell,
    'name': nameCell,
    'groupType': groupCell,
    'formattedPermissions': permissionCell,
    'parentName': parentCell,
    'formattedTags': tagCell,
    '': commandCell,
  };

  const columnRenderer = (gridWidth: number) => (
    sortBy(columnDefinitions, ['orderIndex']).map((column, idx) => (
      <GridColumn
        key={idx}
        {...column}
        title={startCase(getTranslatedText(column.title))}
        minResizableWidth={200}
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
        width={setColumnWidth(column.width as number, gridWidth)}
      />
    )));

  const columnResize = ({ end, columns }: GridColumnResizeEvent) => {
    hideColumnTitleOnResize();
    if (end) {
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
    }
    return false;
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
  const editField = getTranslatedText(TranslatedText[DisplayText.OFFICIAL]);

  const discardEditMode = ({ id }: LoadCompanyGroup) => {
    const index = gridData.findIndex((data) => data.id === id);
    if (gridData[index]) {
      gridData[index].inEdit = false;
    }
    const newDataState = processWithGroups(gridData, dataState);
    setResultState(newDataState);
  };
  const cancel = () => {
    gridData.splice(0, 1);
    const newDataState = processWithGroups(gridData, dataState);
    setResultState(newDataState);
  };

  // Hide Choose Operator Tooltip. There is Kendo-react configuration to do this
  hideOperatorTooltip();

  const tableRenderer = ({ width }: Size) => (
    <>
      <StyledKendoGrid
        className={`${classes.grid} no-row-pointer`}
        style={{ width: `${width}px` }}
        rowHeight={40}
        data={result}
        editField={editField}
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
        {columnRenderer(width)}
        <GridNoRecords>{noDataMessage}</GridNoRecords>
      </StyledKendoGrid>
      {isLoading && <Loader />}
    </>
  );
  const renderBody = () => <AutoSizer>{tableRenderer}</AutoSizer>;

  return (
    <>
      <Grid item xs={12} className={classes.headerGridItem}>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <GridTitle translation="navigation.group.management" />
          </Grid>
          <Grid item>
            <Box display="flex">
              <GMExport gridData={dataState.group?.length ? flatMap(map(result, 'items')) : result}
                columns={columnDefinitions} isGrouped={(dataState?.group || []).length > 0} />
              {canCreateGroups && <AddGroupContainer addGroup={addGroup} />}
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.kendoGridItem}>
        <div style={{ color: 'red' }}>{tableCriteria.apiError}</div>
        {renderBody()}
      </Grid>
    </>
  );
}
