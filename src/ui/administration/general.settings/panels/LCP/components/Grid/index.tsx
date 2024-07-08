import { Grid } from '@material-ui/core';
import { DataResult, process, State } from '@progress/kendo-data-query';
import { getGroupIds, setExpandedState, setGroupIds } from '@progress/kendo-react-data-tools';
import { GridDataStateChangeEvent, GridRowProps, GridToolbar } from '@progress/kendo-react-grid';
import { uniq } from 'lodash';
import React, { useState } from 'react';
import { translate } from '../../../../../../../common/intl';
import KendoDataGrid from '../../../../../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition } from '../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { withThemeNext } from '../../../../../../layout/theme-next';
import SettingsPanel from '../../../../components/SettingsPanel';
import { SettingsPanelProps } from '../../../../types';
import { GroupHeaderCell } from './cell.templates/GroupHeaderCell';
import { DATA_GROUP, DATA_ITEM_KEY, EXPAND_FIELD, initialData, initialDataState } from './constants';
import { LCPSchema } from './schema';
import useStyles from './styles';
import { CustomGroupDataItem, EditableLCP, LCP } from './types';

const LCPGrid: React.FC<SettingsPanelProps> = (props) => {
  const schema: Array<ColumnDefinition<LCP>> = LCPSchema();
  const [dataState, setDataState] = useState<State>(initialDataState);
  const [collapsedState, setCollapsedState] = React.useState<string[]>([]);
  // const [editGroup, setEditGroup] = useState<GroupDescriptor | null>(null);
  const classes = useStyles();
  const [columns]
    = React.useState<Array<ColumnDefinition<LCP>>>(schema);

  // const onEditGroup = (group: GroupDescriptor) => {
  //   setEditGroup(group);
  // };

  // const onSaveGroup = () => {
  //   setEditGroup(null);
  // };

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

  const onAddNew = () => {
    // TODO
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

  const rowRender = (row: React.ReactElement, rowProps: GridRowProps) => {
    if (rowProps.rowType === 'groupHeader') {
      return React.cloneElement(row, {
        ...rowProps,
        children: (
          <td colSpan={rowProps.dataItem.fieldCount ?? 6} className={classes.groupHeader}>
            <GroupHeaderCell {...rowProps} onExpandChange={onExpandChange} />
          </td>
        ),
      });
    }

    return row;
  };

  const onGroupsToggle = React.useCallback((isExpandAll?) => {
    const dataStateWithoutPaging = processWithGroups(initialData, {
      group: dataState.group,
    });

    setCollapsedState(
      isExpandAll ? [] : getGroupIds({ data: dataStateWithoutPaging.data }),
    );
  }, [collapsedState, dataState]);

  const newData = setExpandedState({
    data: resultState.data,
    collapsedIds: collapsedState,
  });

  return <SettingsPanel {...props} title={translate('administration.general.settings.lcp')} onAddNew={onAddNew}>
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
        selectable={{
          enabled: true,
          drag: true,
          cell: true,
          mode: 'multiple',
        }}
        {...dataState}
        filterable={true}
        groupable={true}
        navigatable={true}
        expandField={EXPAND_FIELD}
        rowRender={rowRender}
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
  </SettingsPanel>;
};

export default React.memo(withThemeNext(React.forwardRef(LCPGrid)));
