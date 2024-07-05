import { Grid } from '@material-ui/core';
import { GridRowProps, GridToolbar } from '@progress/kendo-react-grid';
import React, { useState } from 'react';
import { translate } from '../../../../../../../common/intl';
import KendoDataGrid from '../../../../../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition } from '../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { withThemeNext } from '../../../../../../layout/theme-next';
import SettingsPanel from '../../../../components/SettingsPanel';
import { SettingsPanelProps } from '../../../../types';
import { GroupHeaderCell } from './cell.templates/GroupHeaderCell';
import { DATA_GROUP, DATA_ITEM_KEY, initialData } from './constants';
import { LCPSchema } from './schema';
import useStyles from './styles';
import { EditableLCP, LCP } from './types';

const LCPGrid: React.FC<SettingsPanelProps> = (props) => {
  const schema: Array<ColumnDefinition<LCP>> = LCPSchema();
  // const [editGroup, setEditGroup] = useState<GroupDescriptor | null>(null);
  // const [group, setGroup] = useState<GroupDescriptor[]>([{ field: 'category' }]);
  const [data] = useState(initialData);
  const classes = useStyles();
  const [columns]
    = React.useState<Array<ColumnDefinition<LCP>>>(schema);

  // const onEditGroup = (group: GroupDescriptor) => {
  //   setEditGroup(group);
  // };

  // const onSaveGroup = () => {
  //   setEditGroup(null);
  // };

  // const onGroupChange = (group: GroupDescriptor[]) => {
  //   setGroup(group);
  // };

  const onAddNew = () => {
    // TODO
  };

  const getColumns = () => {
    return columns.filter(({ isHidden }) => !isHidden) ?? [];
  };

  const handleExpandAll = () => {
    // TODO
  };

  const handleCollapseAll = () => {
    // TODO
  };

  // const handleExpandCollapse = (group: GroupDataItem) => {
  //   const newGroup = group.expanded
  //     ? collapseGroup(group, group.groupId)
  //     : expandGroup(group, group.groupId);
  //   setGroup(newGroup);
  // };

  const rowRender = (row: React.ReactElement, rowProps: GridRowProps) => {
    console.log('rowProps.dataItem.groupId', rowProps);
    if (rowProps.rowType === 'groupHeader') {
      // handleExpandCollapse={handleExpandCollapse} onEditGroup={onEditGroup} onSaveGroup={onSaveGroup}
      return React.cloneElement(row, {
        ...rowProps,
        children: (
          <td colSpan={rowProps.dataItem.fieldCount ?? 6} className={classes.groupHeader}>
            <GroupHeaderCell {...rowProps} />
          </td>
        ),
      });
    }
    return row;
  };

  return <SettingsPanel {...props} title={translate('administration.general.settings.lcp')} onAddNew={onAddNew}>
    <Grid item>
      <KendoDataGrid<EditableLCP>
        data={data}
        schema={getColumns()}
        group={DATA_GROUP}
        fullWidth
        className={classes.rootMDTable}
        hasBoxScrollbars
        dataItemKey={DATA_ITEM_KEY}
        selectable={{
          enabled: true,
          drag: true,
          cell: true,
          mode: 'multiple',
        }}
        filterable={true}
        groupable={true}
        navigatable={true}
        rowRender={rowRender}
        // onGroupChange={onGroupChange}
        // onRowClick={editMDItem}
        // selectedField={SELECTED_FIELD}
        // rowRender={rowRender}
        // onSelectionChange={onSelectionChange}
        // onKeyDown={onKeyDown}
        // loading={materialDispositionAsync.isLoading || partAsync.isLoading || deleteMDItemAsync.isLoading}
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
              <span onClick={handleExpandAll}>
                {translate('common.expand.all')} /{' '}
              </span>
              <span onClick={handleCollapseAll}>
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
