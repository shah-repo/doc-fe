import { Grid } from '@material-ui/core';
import { DataResult, process, State } from '@progress/kendo-data-query';
import { getGroupIds, setExpandedState, setGroupIds } from '@progress/kendo-react-data-tools';
import { GridDataStateChangeEvent, GridItemChangeEvent, GridRowProps, GridToolbar } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { cloneDeep, uniq } from 'lodash';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../../../common/intl';
import { Button as AddButton } from '../../../../../../components/forms/fields-next';
import KendoDataGrid from '../../../../../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition } from '../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { withThemeNext } from '../../../../../../layout/theme-next';
import SettingsPanel from '../../../../components/SettingsPanel';
import { SettingsPanelProps } from '../../../../types';
import { GroupHeaderCell } from './cell.templates/GroupHeaderCell';
import { ADD_GROUP_ID, DATA_GROUP, DATA_ITEM_KEY, EDIT_FIELD, EXPAND_FIELD, initialData, initialDataState, newSelectedOptions } from './constants';
import { LCPSchema } from './schema';
import useStyles from './styles';
import { CustomGroupDataItem, CustomGroupOptions, EditableLCP, LCP } from './types';

const LCPGrid: React.FC<SettingsPanelProps> = (props) => {
  const schema: Array<ColumnDefinition<LCP>> = LCPSchema();
  const [dataState, setDataState] = useState<State>(initialDataState);
  const [prevData, setPrevData] = useState<LCP[]>(initialData);
  const [collapsedState, setCollapsedState] = React.useState<string[]>([]);
  const [editGroup, setEditGroup] = useState<string>('');
  const classes = useStyles();
  const [columns]
    = React.useState<Array<ColumnDefinition<LCP>>>(schema);

  const onDataStateChange = (event: GridDataStateChangeEvent): State => {
    const newDataState = processWithGroups(initialData, event.dataState);
    setDataState(event.dataState);
    setResultState(newDataState);
    return dataState;
  };

  const processWithGroups = (data: LCP[], dataState: State) => {
    const newDataState = process(data, dataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };

  const [resultState, setResultState] = useState<DataResult>(
    processWithGroups(initialData, initialDataState),
  );

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
    setPrevData(cloneDeep(initialData));
    setEditGroup(dataItem.groupId);
  };

  const onDiscardGroup = () => {
    setEditGroup('');
    setResultState(processWithGroups(prevData, initialDataState));
  };

  const onDeleteGroup = (dataItem: CustomGroupDataItem) => {
    setResultState(processWithGroups(initialData.filter((data: LCP) => `${data.category}category` !== dataItem.groupId), initialDataState));
    setPrevData(initialData.filter((data: LCP) => `${data.category}category` !== dataItem.groupId));
  };

  const onGroupChange = (options: CustomGroupOptions[]) => {
    setResultState(processWithGroups([...newSelectedOptions, ...initialData.filter((data: LCP) => `${data.category}category` !== ADD_GROUP_ID)], initialDataState));
    setEditGroup('PARTScategory');
  };

  const onUpdateAddOrEditGroup = (dataItem: CustomGroupDataItem) => {
    setEditGroup('');
  };

  const rowRender = (row: React.ReactElement, rowProps: GridRowProps) => {
    if (rowProps.rowType === 'groupHeader') {
      return React.cloneElement(row, {
        ...rowProps,
        className: cx(row.props.className, { updatingRow: editGroup === rowProps.dataItem.groupId }),
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
      className: cx(row.props.className, { updatingRow: editGroup === `${rowProps.dataItem.category}category` }),
    });
  };

  const onGroupsToggle = React.useCallback((isExpandAll?) => {
    const dataStateWithoutPaging = processWithGroups(initialData, {
      group: dataState.group,
    });

    setCollapsedState(
      isExpandAll ? [] : getGroupIds({ data: dataStateWithoutPaging.data }),
    );
  }, [collapsedState, dataState]);

  const getUpdatedStateDataByEditInfo = React.useCallback((resultState) => {
    resultState.data?.forEach(group => {
      group.items?.forEach((data) => {
        data[EDIT_FIELD] = group.groupId === editGroup;
        return data;
      });
      return group;
    });

    return resultState.data;
  }, [editGroup, resultState]);

  const newData = setExpandedState({
    data: getUpdatedStateDataByEditInfo(resultState),
    collapsedIds: collapsedState,
  });

  const onItemChange = (e: GridItemChangeEvent) => {
    resultState.data?.forEach(group => {
      if (group.groupId === `${e.dataItem.category}category`) {
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

  const addLCP = React.useCallback(() => {
    setPrevData(cloneDeep(initialData));

    initialData.push({
      id: uuidv4(),
      enlilType: '',
      displayLabel: '',
      isAllowedOnPO: '',
      isAllowedOnLhrProd: '',
      category: 'Add',
      isAllowedToBuy: '',
      [EDIT_FIELD]: true,
      isAdd: true,
    } as LCP);
    setEditGroup(ADD_GROUP_ID);

    setResultState(processWithGroups(initialData, initialDataState));
  }, []);

  return <SettingsPanel {...props} title={translate('administration.general.settings.lcp')} onAddNew={addLCP}>
    <Grid item>
      <KendoDataGrid<EditableLCP>
        data={newData}
        schema={getColumns()}
        onDataStateChange={onDataStateChange}
        total={resultState.total}
        group={DATA_GROUP}
        fullWidth
        className={classes.rootMDTable}
        hasBoxScrollbars
        dataItemKey={DATA_ITEM_KEY}
        skipDataProcessing
        {...dataState}
        filterable={true}
        groupable={true}
        navigatable={true}
        expandField={EXPAND_FIELD}
        rowRender={rowRender}
        onItemChange={onItemChange}
        resizable={true}
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
      {<AddButton
        fullWidth
        attached
        kind="add"
        // className={classes.bottomAddButtom}
        data-cy="fb-control-btn"
        onClick={addLCP}
      >
        {translate('form.builder.add.item')}
      </AddButton>}
    </Grid>
  </SettingsPanel>;
};

export default React.memo(withThemeNext(React.forwardRef(LCPGrid)));
