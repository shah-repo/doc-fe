import { Grid } from '@material-ui/core';
import { DataResult, process, State } from '@progress/kendo-data-query';
import { getGroupIds, setExpandedState, setGroupIds } from '@progress/kendo-react-data-tools';
import { GridDataStateChangeEvent, GridItemChangeEvent, GridRowProps, GridToolbar } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { cloneDeep, last, uniq, uniqBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../../../common/intl';
import { Button as AddButton } from '../../../../../../components/forms/fields-next';
import KendoDataGrid from '../../../../../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition } from '../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { withThemeNext } from '../../../../../../layout/theme-next';
import SettingsPanel from '../../../../components/SettingsPanel';
import { SettingsPanelProps } from '../../../../types';
import { GroupHeaderCell } from './cell.templates/GroupHeaderCell';
import { ADD_GROUP_ID, ADD_GROUP_NAME, DATA_GROUP, DATA_ITEM_KEY, EDIT_FIELD, EXPAND_FIELD, initialData, initialDataState, newSelectedOptions, PARTS_GROUP_ID } from './constants';
import { LCPSchema } from './schema';
import useStyles from './styles';
import { CustomGroupDataItem, CustomGroupOptions, EditableLCP, LCP } from './types';
import { sortGroups } from './utils';

const LCPGrid: React.FC<SettingsPanelProps> = (props) => {
  const schema: Array<ColumnDefinition<LCP>> = LCPSchema();
  const [dataState, setDataState] = useState<State>(initialDataState);
  const [data, setData] = useState<LCP[]>();
  const [prevData, setPrevData] = useState<LCP[]>();
  const [resultState, setResultState] = useState<DataResult>();
  const [collapsedState, setCollapsedState] = React.useState<string[]>([]);
  const [editGroup, setEditGroup] = useState<string>('');
  const classes = useStyles();
  const [columns]
    = React.useState<Array<ColumnDefinition<LCP>>>(schema);

  useEffect(() => {
    updateStateGridData(initialData);
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
    return `${category}category`;
  };

  const updateStateGridData = (updatedData: LCP[]) => {
    setData(updatedData);
    setPrevData(cloneDeep(updatedData));
    setResultState(processWithGroups(updatedData, initialDataState));
  };

  const onDeleteGroup = (dataItem: CustomGroupDataItem) => {
    const updatedData = (data ?? []).filter((data: LCP) => getGroupIdByCategory(data.category) !== dataItem.groupId);
    updateStateGridData(updatedData);
  };

  const onGroupChange = (options: CustomGroupOptions[]) => {
    const updatedData = newSelectedOptions.concat((data ?? []).filter((data: LCP) => getGroupIdByCategory(data.category) !== ADD_GROUP_ID));
    console.log('updatedData ::', updatedData);
    updateStateGridData(uniqBy(updatedData, 'id'));
    setEditGroup(PARTS_GROUP_ID);
  };

  const onUpdateAddOrEditGroup = (dataItem: CustomGroupDataItem) => {
    setEditGroup('');
  };

  const isLastGroupRow = (id: string) => {
    const group = resultState?.data.find((item: CustomGroupDataItem) => getGroupIdByCategory(item.value) === editGroup) as CustomGroupDataItem;
    const lastItem = last(group?.items ?? []) as LCP;
    return lastItem?.id === id;
  };

  const rowRender = (row: React.ReactElement, rowProps: GridRowProps) => {
    if (rowProps.rowType === 'groupHeader') {
      const groupId = rowProps.dataItem.groupId;
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

  const getUpdatedStateDataByEditInfo = React.useCallback((resultState) => {
    resultState?.data?.forEach(group => {
      group.items?.forEach((data) => {
        data[EDIT_FIELD] = group.groupId === editGroup;
        return data;
      });
      return group;
    });

    return sortGroups(resultState?.data ?? []);
  }, [editGroup, resultState]);

  const onItemChange = (e: GridItemChangeEvent) => {
    resultState?.data?.forEach(group => {
      if (group.groupId === getGroupIdByCategory(e.dataItem.category)) {
      group.items?.forEach((data) => {
        if (data.id === e.dataItem.id) {
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
        isAllowedToBuy: '',
        [EDIT_FIELD]: true,
        isAdd: true,
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
