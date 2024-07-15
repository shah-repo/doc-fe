import { Grid } from '@material-ui/core';
import { DataResult, process, State } from '@progress/kendo-data-query';
import { getGroupIds, setExpandedState, setGroupIds } from '@progress/kendo-react-data-tools';
import { GridDataStateChangeEvent, GridItemChangeEvent, GridRowProps, GridToolbar } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { cloneDeep, last, pick, uniq, uniqBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../../../common/intl';
import { Button as AddButton } from '../../../../../../components/forms/fields-next';
import KendoDataGrid from '../../../../../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition, DataGridProps } from '../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { withThemeNext } from '../../../../../../layout/theme-next';
import SettingsPanel from '../../../../components/SettingsPanel';
import { SettingsPanelProps } from '../../../../types';
import { GroupHeaderCell } from './cell.templates/GroupHeaderCell';
import { ADD_GROUP_ID, ADD_GROUP_NAME, DATA_GROUP, DATA_ITEM_KEY, EDIT_FIELD, EXPAND_FIELD, initialDataState, LCP_KEYS, newSelectedOptions, PARTS_GROUP_ID, realTimeData, REQUEST_PAYLOAD_KEYS } from './constants';
import { LCPSchema } from './schema';
import useStyles from './styles';
import { CustomGroupDataItem, CustomGroupOptions, EditableLCP, LCP, LCPResponse } from './types';
import { processRealData, sortGroups } from './utils';

const LCPGrid: React.FC<SettingsPanelProps> = (props) => {
  const schema: Array<ColumnDefinition<LCP>> = LCPSchema();
  const [dataState, setDataState] = useState<State>(initialDataState);
  const [partGroups, setPartGroups] = useState<CustomGroupOptions[]>([]);
  const [data, setData] = useState<LCP[]>();
  const [prevData, setPrevData] = useState<LCP[]>();
  const [resultState, setResultState] = useState<DataResult>();
  const [collapsedState, setCollapsedState] = React.useState<string[]>([]);
  const [editGroup, setEditGroup] = useState<string>('');
  const classes = useStyles();
  const [columns]
    = React.useState<Array<ColumnDefinition<LCP>>>(schema);

  const { getFieldProps, setValues, values: formValues } = useFormikContext();
  const lifeCycleData = getFieldProps('lifecyclePhases') as unknown as { categories: LCPResponse[] };

  useEffect(() => {
    const data = processRealData(lifeCycleData.categories ?? realTimeData.categories as unknown as LCPResponse[]);
    updateStateGridData(data.phases);
    setPartGroups(data.groups);
  }, []);

  const onDataStateChange = (event: GridDataStateChangeEvent): State => {
    const newDataState = processWithGroups(data ?? [], event.dataState);
    setDataState(event.dataState);
    setResultState(newDataState);
    return dataState;
  };

  const processWithGroups = (data: LCP[], dataState: State) => {
    const newDataState = process(data, dataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };

  const getColumns = () => {
    return columns.filter(({ isHidden }) => !isHidden) ?? [];
  };

  const onExpandChange = React.useCallback(
    (dataItem: CustomGroupDataItem) => {
      if (dataItem.groupId) {
        const collapsedIds = !dataItem.expanded
          ? collapsedState.filter((groupId) => groupId !== dataItem.groupId)
          : [...collapsedState, dataItem.groupId];
        setCollapsedState(uniq(collapsedIds));
      }
    },
    [collapsedState],
  );

  const onEditGroup = (dataItem: CustomGroupDataItem) => {
    setPrevData(cloneDeep(data));
    setEditGroup(dataItem.groupId);
  };

  const onDiscardGroup = () => {
    setEditGroup('');
    setResultState(processWithGroups(prevData ?? [], initialDataState));
  };

  const getGroupIdByCategory = (category: string): string => {
    return `${category}${LCP_KEYS.category}`;
  };

  const updateStateGridData = (updatedData: LCP[]) => {
    setData(updatedData);
    setPrevData(cloneDeep(updatedData));
    setResultState(processWithGroups(updatedData, initialDataState));
  };

  const updateSettingsObj = (updatedData) => {
    // TODO call API POST HERE
    const payload = updatedData?.map((item) => pick(item, REQUEST_PAYLOAD_KEYS));
    console.log('Data Final to save settings ', payload);
    // updated formik here
    formValues.lifecyclePhases = payload;
    setValues(formValues);
  };

  const onDeleteGroup = (dataItem: CustomGroupDataItem) => {
    const updatedData = (data ?? []).filter((data: LCP) => getGroupIdByCategory(data.category) !== dataItem.groupId);
    updateStateGridData(updatedData);
    updateSettingsObj(updatedData);
  };

  const onGroupChange = (options: CustomGroupOptions[], groupId: string) => {
    const selectedGroudIds = options.map(data => data.value);

    if ([PARTS_GROUP_ID, ADD_GROUP_ID].includes(groupId)) {
      // new Add case

      // newSelectedOptions will fetch from DB
      newSelectedOptions.forEach(data => {
        data.documentTypeIdArr = selectedGroudIds;
        return data;
      });
      const updatedData = newSelectedOptions.concat((data ?? []).filter((data: LCP) => getGroupIdByCategory(data.category) !== ADD_GROUP_ID));
      updateStateGridData(uniqBy(updatedData, 'id'));
      setEditGroup(PARTS_GROUP_ID);
    } else {
      // Edit case
      if (data) {
      data?.forEach(data => {
        if (getGroupIdByCategory(data.category) === groupId) {
          data.documentTypeIdArr = selectedGroudIds;
        }
        return data;
      });
      updateStateGridData(data);
      setEditGroup(groupId);
      }
    }
  };

  const onUpdateAddOrEditGroup = (dataItem: CustomGroupDataItem) => {
    setEditGroup('');
    updateSettingsObj(data);
  };

  const isLastGroupRow = (id: string) => {
    const group = resultState?.data.find((item: CustomGroupDataItem) => getGroupIdByCategory(item.value) === editGroup) as CustomGroupDataItem;
    const lastItem = last(group?.items ?? []) as LCP;
    return lastItem?.id === id;
  };

  const rowRender: DataGridProps<LCP>['rowRender'] = (row: React.ReactElement, rowProps: GridRowProps) => {
    if (rowProps.rowType === 'groupHeader') {
      const groupId = rowProps.dataItem.groupId as string;
      return React.cloneElement(row, {
        ...rowProps,
        className: cx(row.props.className, { updatingRow: editGroup === groupId }, { groupLastRow: groupId === ADD_GROUP_ID && rowProps.dataItem.items.length === 1 }),
        children: (
          <td colSpan={rowProps.dataItem.fieldCount ?? 6} className="groupHeader">
            <GroupHeaderCell
              {...rowProps}
              onExpandChange={onExpandChange}
              onEditGroup={onEditGroup}
              editGroup={editGroup}
              partGroups={partGroups}
              onDiscardGroup={onDiscardGroup}
              onUpdateAddOrEditGroup={onUpdateAddOrEditGroup}
              onDeleteGroup={onDeleteGroup}
              onGroupChange={onGroupChange} />
          </td>
        ),
      });
    }

    if (rowProps.dataItem.isAdd) {
      // hide other elements while adding the row
      return <></>;
    }

    return React.cloneElement(row, {
      ...rowProps,
      className: cx(row.props.className, { updatingRow: editGroup === getGroupIdByCategory(rowProps.dataItem.category) }, { groupLastRow: isLastGroupRow(rowProps?.dataItem?.id) }),
    });
  };

  const onGroupsToggle = React.useCallback((isExpandAll?) => {
    const dataStateWithoutPaging = processWithGroups((data ?? []), {
      group: dataState.group,
    });

    setCollapsedState(
      isExpandAll ? [] : getGroupIds({ data: dataStateWithoutPaging.data }),
    );
  }, [collapsedState, dataState]);

  const getUpdatedStateDataByEditInfo = React.useCallback((resultState?: DataResult) => {
    resultState?.data?.forEach((group: CustomGroupDataItem) => {
      group.items?.forEach((data) => {
        data[EDIT_FIELD] = group.groupId === editGroup;
        return data;
      });
      return group;
    });

    return sortGroups(resultState?.data ?? []);
  }, [editGroup, resultState]);

  const onItemChange = (e: GridItemChangeEvent) => {
    resultState?.data?.forEach((group: CustomGroupDataItem) => {
      if (group.groupId === getGroupIdByCategory(e.dataItem.category)) {
      group.items?.forEach((data) => {
        if (data.id === e.dataItem.id) {
          data.isUserModified = true;
          data[e.field || ''] = e.value;
        }
        return data;
      });
      }
      return group;
    });

    setResultState(resultState);
  };

  const addLCP = () => {
    setPrevData(cloneDeep(data));
    const newData = [
      ...(data ?? []),
      {
        id: uuidv4(),
        enlilType: '',
        displayLabel: '',
        isAllowedOnPO: '',
        isAllowedOnLhrProd: '',
        category: ADD_GROUP_NAME,
        documentTypeIdArr: [],
        isAllowedToBuy: '',
        [EDIT_FIELD]: true,
        isAdd: true,
        isUserAdded: true,
        isUserModified: false,
      },
    ];
    setData(newData);
    setEditGroup(ADD_GROUP_ID);
    setResultState(processWithGroups(newData, initialDataState));
  };

  const newData = setExpandedState({
    data: getUpdatedStateDataByEditInfo(resultState),
    collapsedIds: collapsedState,
  });

  return <SettingsPanel {...props} title={translate('administration.general.settings.lcp')} onAddNew={addLCP}>
    <Grid item>
      <KendoDataGrid<EditableLCP>
        {...dataState}
        data={newData}
        schema={getColumns()}
        onDataStateChange={onDataStateChange}
        total={resultState?.total}
        group={DATA_GROUP}
        fullWidth
        className={classes.rootMDTable}
        hasBoxScrollbars
        dataItemKey={DATA_ITEM_KEY}
        skipDataProcessing
        filterable={true}
        groupable={true}
        navigatable={true}
        expandField={EXPAND_FIELD}
        rowRender={rowRender}
        onItemChange={onItemChange}
      >
        <GridToolbar>
          <Grid container justify="flex-start"
            className={classes.toolbarContainer}
          >
            <Grid
              item
              data-cy="collapse-expand-collapse"
              className={classes.toggleExpandCollapse}
              alignItems="center"
              justify="center"
            >
              <span onClick={() => onGroupsToggle(true)}>
                {translate('common.expand.all')} /{' '}
              </span>
              <span onClick={() => onGroupsToggle()}>
                {translate('common.collapse.all')}
              </span>
            </Grid>
          </Grid>
        </GridToolbar>
      </KendoDataGrid>
    </Grid>
    <Grid item>
      <AddButton
        fullWidth
        attached
        kind="add"
        data-cy="add-lcp-button"
        onClick={addLCP}
      >
        {translate('form.builder.add.item')}
      </AddButton>
    </Grid>
  </SettingsPanel>;
};

export default React.memo(withThemeNext(React.forwardRef(LCPGrid)));
