import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import {
  getTableCriteria,
  getTableData,
} from '../../../common/utils/selectors';
import { authSelectors } from '../../../state/ducks/auth';
import { GroupTag } from '../../../state/ducks/auth/types';
import tableSearchActions from '../../../state/ducks/tableSearch/actions';
import { userManagementActions } from '../../../state/ducks/userManagement';
import { LoadCompanyGroup } from '../../../state/ducks/userManagement/types';
import { HOME_URL } from '../../constants/urls';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';
import useGetHasTag from '../../hooks/useGetHasTag';
import {
  getHasOfficialPermissions,
  getHasUnofficialPermissions,
  getIsMemberOfGroup,
} from '../utils/helpers';
import { DEFAULT_SELECTED_GROUP } from '../utils/types';
import KendoPresenter from './presenter';

const KendoContainer: React.FunctionComponent<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const editGroupsDialog = useDialog();
  const previewGroupsDialog = useDialog();
  const [selectedGroup, setGroup] = useState<LoadCompanyGroup>(
    DEFAULT_SELECTED_GROUP,
  );

  const TABLE_NAME = 'groupManagement';
  const tableData = useSelector(getTableData(TABLE_NAME));
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const canManageGroups = useGetHasTag(GroupTag.GROUP_MANAGEMENT);

  const clearFilter = () =>
    dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));

  const currentEmployeePermissions = useSelector(
    authSelectors.currentEmployeePermissions,
  );
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);

  const hasOfficialPermissions = getHasOfficialPermissions(
    currentEmployeePermissions,
  );
  const hasUnofficialPermissions = getHasUnofficialPermissions(
    currentEmployeePermissions,
  );
  const canCreateGroups = hasOfficialPermissions || hasUnofficialPermissions;

  const asyncPreview = useAsync({
    onSuccess: (data) => {
      setGroup(data as LoadCompanyGroup);
      previewGroupsDialog.open();
    },
  });

  const asyncEdit = useAsync({
    onSuccess: (data) => {
      setGroup(data as LoadCompanyGroup);
      editGroupsDialog.open();
    },
  });

  const loadGroupByIdAction = useActionCreator(
    userManagementActions.loadGroupById,
  );

  const handleGroupsPreview = ({ id }: LoadCompanyGroup) => {
    asyncPreview.start(loadGroupByIdAction, id, asyncPreview);
  };

  const handleGroupsEdit = ({ id }: LoadCompanyGroup) => {
    asyncEdit.start(loadGroupByIdAction, id, asyncEdit);
  };

  const handlePermission = (rowData: LoadCompanyGroup) => {
    const isMemberOfGroup = getIsMemberOfGroup(
      rowData.employees,
      currentEmployeeId,
    );
    const canEditOfficialGroup = rowData.isOfficial && hasOfficialPermissions;
    const canEditUnofficialGroup
      = !rowData.isOfficial
      && (hasUnofficialPermissions || hasOfficialPermissions)
      && isMemberOfGroup;
    if (canEditOfficialGroup || canEditUnofficialGroup) {
      handleGroupsEdit(rowData);
    } else {
      handleGroupsPreview(rowData);
    }
  };

  if (!canManageGroups) {
    return <Redirect to={HOME_URL} />;
  }

  return (
    <KendoPresenter
      tableName={TABLE_NAME}
      clearFilter={clearFilter}
      tableData={tableData}
      tableCriteria={tableCriteria}
      handlePermission={handlePermission}
      previewGroupsDialog={previewGroupsDialog}
      editGroupsDialog={editGroupsDialog}
      selectedGroup={selectedGroup}
      canCreateGroups={canCreateGroups}
    />
  );
};

export default KendoContainer;
