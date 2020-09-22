import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import { authSelectors } from "../../../state/ducks/auth";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import { LoadCompanyGroup, userManagementActions } from "../../../state/ducks/userManagement";

import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import ListPresenter from "./presenter";
import { DEFAULT_SELECTED_GROUP } from "../../group.management/utils/types";
import { getHasOfficialPermissions, getHasUnofficialPermissions, getIsMemberOfGroup } from "../../group.management/utils/helpers";

type OwnProps = RouteComponentProps;
export type Props = OwnProps;

export const TrainingListContainer: React.FunctionComponent<Props> = () => {
  const dispatch = useDispatch();
  const editGroupsDialog = useDialog();
  const previewGroupsDialog = useDialog();
  const [selectedGroup, setGroup] = useState<LoadCompanyGroup>(DEFAULT_SELECTED_GROUP);

  const TABLE_NAME = "training";
  const tableData = useSelector(getTableData(TABLE_NAME));
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));

  console.log(TABLE_NAME);
  console.log(tableData);

  const clearFilter = () =>
    dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));

  const currentEmployeePermissions = useSelector(authSelectors.currentEmployeePermissions);
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);

  const hasOfficialPermissions = getHasOfficialPermissions(currentEmployeePermissions);
  const hasUnofficialPermissions = getHasUnofficialPermissions(currentEmployeePermissions);
  const canCreateGroups = hasOfficialPermissions || hasUnofficialPermissions;

  const asyncPreview = useAsync({
    onSuccess: (data: any) => {
      setGroup(data);
      previewGroupsDialog.open();
    },
  });

  const asyncEdit = useAsync({
    onSuccess: (data: any) => {
      setGroup(data);
      editGroupsDialog.open();
    },
  });

  const loadGroupByIdAction = useActionCreator(userManagementActions.loadGroupById);

  const handleGroupsPreview = (rowData: LoadCompanyGroup) => {
    asyncPreview.start(loadGroupByIdAction, rowData.id, asyncPreview);
  };

  const handleGroupsEdit = (rowData: LoadCompanyGroup) => {
    asyncEdit.start(loadGroupByIdAction, rowData.id, asyncEdit);
  };

  const handlePermission = (rowData: LoadCompanyGroup) => {
    const isMemberOfGroup = getIsMemberOfGroup(rowData.employees, currentEmployeeId);
    const canEditOfficialGroup = rowData.isOfficial && hasOfficialPermissions;
    const canEditUnofficialGroup =
      !rowData.isOfficial && (hasUnofficialPermissions || hasOfficialPermissions) && isMemberOfGroup;
    if (canEditOfficialGroup || canEditUnofficialGroup) {
      handleGroupsEdit(rowData);
    } else {
      handleGroupsPreview(rowData);
    }
  };

  return (
    <ListPresenter
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

export default TrainingListContainer;
