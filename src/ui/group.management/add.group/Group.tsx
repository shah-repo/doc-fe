import { Dialog } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTableCriteria } from '../../../common/utils/selectors';
import { authSelectors } from '../../../state/ducks/auth';
import { tableSearchActions } from '../../../state/ducks/tableSearch';
import { GetEmployeeResponse, LoadCompanyGroup } from '../../../state/ducks/userManagement/types';
import DialogTitle from '../dialog/DialogTitle';
import { getHasOfficialPermissions } from '../utils/helpers';
import GroupContentContainer from './GroupContent.container';

interface Props {
  isOpen: boolean
  closeDialog: (flag?: boolean) => void
  selectedGroup?: LoadCompanyGroup
  title: any
  isCreateMode?: boolean
  activeEmployees?: GetEmployeeResponse[]
}

const AddGroup: React.FunctionComponent<Props> = ({
  isOpen,
  closeDialog,
  selectedGroup,
  title,
  isCreateMode,
  activeEmployees,
}) => {
  const dispatch = useDispatch();

  const TABLE_NAME = 'groupManagement';
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const currentEmployeePermissions = useSelector(
    authSelectors.currentEmployeePermissions,
  );
  const hasOfficialPermission = getHasOfficialPermissions(
    currentEmployeePermissions,
  );

  const handleTableRefresh = () => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          queryDict: {
            groupName: '',
          },
        },
        TABLE_NAME,
      ),
    );
  };

  return (
    <Dialog fullScreen={false} open={isOpen} fullWidth
      maxWidth="xl"
    >
      <DialogTitle
        closeDialog={closeDialog}
        title={title}
      />
      <GroupContentContainer
        selectedGroup={selectedGroup}
        isCreateMode={isCreateMode}
        employees={activeEmployees}
        handleTableRefresh={handleTableRefresh}
        closeDialog={closeDialog}
        currentEmployeePermissions={currentEmployeePermissions}
        hasOfficialPermission={hasOfficialPermission}
      />
    </Dialog>
  );
};

export default AddGroup;
