import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, Redirect } from "react-router-dom";
import {
  getTableCriteria,
  getTableData,
  getHasTag,
} from "../../../common/utils/selectors";
import { authSelectors } from "../../../state/ducks/auth";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import { LoadCompanyGroup } from "../../../state/ducks/userManagement";
import useDialog from "../../hooks/useDialog";
import { getHasOfficialPermissions, getHasUnofficialPermissions } from "../utils/helpers";
import { DEFAULT_SELECTED_GROUP } from "../utils/types";
import ListPresenter from "./presenter";
import { GroupTag } from "../../../state/ducks/auth/types";
import { HOME_URL } from "../../constants/urls";

type OwnProps = RouteComponentProps;
export type Props = OwnProps;

export const ListContainer: React.FunctionComponent<Props> = () => {
  const dispatch = useDispatch();
  const editGroupsDialog = useDialog();
  const previewGroupsDialog = useDialog();
  const [selectedGroup, setGroup] = useState<LoadCompanyGroup>(DEFAULT_SELECTED_GROUP);

  const TABLE_NAME = "groupManagement";
  const tableData = useSelector(getTableData(TABLE_NAME));
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const canManageGroups = useSelector(getHasTag(GroupTag.GROUP_MANAGEMENT));

  const clearFilter = () =>
    dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));

  const currentEmployeePermissions = useSelector(authSelectors.currentEmployeePermissions);
  const hasOfficialPermissions = getHasOfficialPermissions(currentEmployeePermissions);
  const hasUnofficialPermissions = getHasUnofficialPermissions(currentEmployeePermissions);
  const canCreateGroups = hasOfficialPermissions || hasUnofficialPermissions;

  const handleGroupsPreview = (rowData: LoadCompanyGroup) => {
    setGroup(rowData);
    previewGroupsDialog.open();
  };

  const handleGroupsEdit = (rowData: LoadCompanyGroup) => {
    setGroup(rowData);
    editGroupsDialog.open();
  };

  const handlePermission = (rowData: LoadCompanyGroup) => {
    if (hasOfficialPermissions && hasOfficialPermissions) {
      handleGroupsEdit(rowData);
    } else if (!rowData.isOfficial && hasUnofficialPermissions && !hasOfficialPermissions) {
      handleGroupsEdit(rowData);
    } else {
      handleGroupsPreview(rowData);
    }
  };
  
  if (!canManageGroups) {
    return <Redirect to={HOME_URL} />;
  }

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

export default ListContainer;
