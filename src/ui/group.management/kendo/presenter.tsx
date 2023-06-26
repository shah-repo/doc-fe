import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { GROUPS_URL } from '../../../state/ducks/userManagement/constants';
import { LoadCompanyGroup } from '../../../state/ducks/userManagement/types';
import {
  TableDataProps,
  TablePanelStateProps,
} from '../../components/table/types';
import useDialog from '../../hooks/useDialog';
import AddGroup from '../add.group/Group';
import GroupsDisplay from '../display.groups/GroupsDisplay';
import gridConfiguration from './column.definition';
import { KendoPanel } from './KendoPanel';

interface Props {
  tableName: string
  tableData: TableDataProps<LoadCompanyGroup>
  clearFilter?: () => void
  tableCriteria: TablePanelStateProps
  handlePermission: (dataItem: LoadCompanyGroup) => void
  previewGroupsDialog: ReturnType<typeof useDialog>
  editGroupsDialog: ReturnType<typeof useDialog>
  selectedGroup: LoadCompanyGroup
  canCreateGroups: boolean
}

const GroupManagementKendoPresenter: React.FunctionComponent<Props> = ({
  tableName,
  tableData,
  tableCriteria,
  handlePermission,
  previewGroupsDialog,
  editGroupsDialog,
  selectedGroup,
  canCreateGroups,
}) => {
  const [refreshTable, setRefreshTable] = useState(false);
  const closeDialog = (flag: boolean | undefined) => {
    if (flag) {
      setRefreshTable(true);
    }
    setRefreshTable(false);
    editGroupsDialog.close();
  };
  return (
    <Grid container>
      <KendoPanel<LoadCompanyGroup>
        gridConfiguration={gridConfiguration}
        queryUrl={GROUPS_URL}
        tableName={tableName}
        onSelect={({ dataItem }) => () => handlePermission(dataItem)}
        refreshTable={refreshTable}
        canCreateGroups={canCreateGroups}
        gridData={tableData}
        tableCriteria={tableCriteria}
      />
      <GroupsDisplay
        closeDialog={previewGroupsDialog.close}
        isOpen={previewGroupsDialog.isOpen}
        selectedGroup={selectedGroup}
      />
      <AddGroup
        isOpen={editGroupsDialog.isOpen}
        closeDialog={closeDialog}
        selectedGroup={selectedGroup}
        title="group.management.edit.group"
      />
    </Grid>
  );
};

export default GroupManagementKendoPresenter;
