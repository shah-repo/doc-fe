import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { userManagementActions } from '../../../state/ducks/userManagement';
import { GROUPS_URL } from '../../../state/ducks/userManagement/constants';
import { GetEmployeeResponse, LoadCompanyGroup } from '../../../state/ducks/userManagement/types';
import {
  TableDataProps,
  TablePanelStateProps,
} from '../../components/table/types';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';
import useDidMount from '../../hooks/useDidMount';
import AddGroup from '../add.group/Group';
import GroupsDisplay from '../display.groups/GroupsDisplay';
import { DEFAULT_ACTIVE_EMPLOYEES } from '../utils/types';
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
  const didMount = useDidMount();
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [didMount]);
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
        activeEmployees={activeEmployees}
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
        activeEmployees={activeEmployees}
      />
    </Grid>
  );
};

export default GroupManagementKendoPresenter;
