import { isEmpty, omit } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import { Group } from "../../../state/ducks/auth/types";
import { groupManagementActions } from "../../../state/ducks/groupManagement";
import { GroupRequestBody } from "../../../state/ducks/groupManagement/types";
import { GetEmployeeResponse, LoadCompanyGroup, userManagementActions, userManagementSelectors } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import useAsync from "../../hooks/useAsync";
import { getHasOfficialPermissions } from "../utils/helpers";
import { toArrayOfIds, toMembersOptions, toParentOptions, toRequestBody } from "../utils/transform";
import { DEFAULT_GROUP } from "../utils/types";
import GroupContentPresenter from "./GroupContent.presenter";

interface Props {
  selectedGroup?: LoadCompanyGroup;
  isCreateMode?: boolean;
  employees: GetEmployeeResponse[];
  handleTableRefresh: () => void;
  closeDialog: () => void;
}

export const GroupContentContainer: React.FunctionComponent<Props> = ({
  selectedGroup,
  isCreateMode,
  employees,
  handleTableRefresh,
  closeDialog,
}) => {
  const [group, setGroup] = useState<GroupRequestBody>(DEFAULT_GROUP);
  const [members, setMembers] = useState<OptionType[]>([]);
  const [parentGroups, setParentGroups] = useState<OptionType[]>([]);
  const currentEmployeePermissions = useSelector(
    authSelectors.currentEmployeePermissions,
  );
  const currentEmployeeTags = useSelector(authSelectors.currentEmployeeTags);
  const hasOfficialPermission = getHasOfficialPermissions(
    currentEmployeePermissions,
  );
  const allGroups = useSelector(userManagementSelectors.getOfficialGroups);
  const currentGroupData = useSelector(userManagementSelectors.getCurrentGroup);
  const [currentGroups, setCurrentGroups] = useState(
    isCreateMode ? [] : currentGroupData.joinedParents.filter((joinedParent) => joinedParent.id !== currentGroupData.id)
  );
  const dispatch = useDispatch();
  const createGroupAsync = useAsync({
    onSuccess: (response) => {
      handleTableRefresh();
      handleReset();
      dispatch(userManagementActions.loadCompanyGroups());
    },
  });

  const editGroupAsync = useAsync({
    onSuccess: (response) => {
      handleTableRefresh();
      dispatch(userManagementActions.loadCompanyGroups());
      closeDialog();
    },
  });

  const handleCreateGroup = (values: GroupRequestBody) => {
    dispatch(
      groupManagementActions.createGroup(
        { ...values, employees: toRequestBody(members), parents: toRequestBody(parentGroups) },
        createGroupAsync,
      ),
    );
  };

  const handleEditGroup = (groupId: string, values: GroupRequestBody) => {
    const isGroupNameChanged = !(selectedGroup!.name === values.name);
    const body = isGroupNameChanged ?
      { ...values, employees: toRequestBody(members), parents: toRequestBody(parentGroups) } :
      omit({ ...values, employees: toRequestBody(members), parents: toRequestBody(parentGroups) }, ["name"] );
    dispatch(
      groupManagementActions.editGroup(
        groupId,
        body,
        editGroupAsync,
      ),
    );
  };

  useEffect(() => {
    if (selectedGroup) {
      setGroup({
        name: selectedGroup.name,
        permissions: selectedGroup.permissions,
        defaultForNewUsers: selectedGroup.defaultForNewUsers,
        isOfficial: selectedGroup.isOfficial,
        tags: selectedGroup.tags || [],
        employees: toArrayOfIds(selectedGroup.employees),
        parents: toArrayOfIds(selectedGroup.parents),
      });
      setMembers(
        toMembersOptions(
          (selectedGroup.employees as unknown) as GetEmployeeResponse[],
        ),
      );
      setParentGroups(
        toParentOptions(
          (selectedGroup.parents as unknown) as Group[],
        ),
      );
    }
  }, [selectedGroup]);

  const handleReset = () => {
    setGroup(DEFAULT_GROUP);
    setParentGroups([]);
    setMembers([]);
    setCurrentGroups([]);
  };

  const handleSubmit = () => {
    isCreateMode ?  handleCreateGroup(group) : handleEditGroup(selectedGroup!.id, group);
  };

  const  handleAsyncState = () => isCreateMode ? createGroupAsync.asyncState : editGroupAsync.asyncState;

  const onSelectParentGroup = (selectedItems: any) => {
    if (isEmpty(selectedItems)) {
      setParentGroups([]);
      return;
    }
    const selectedItemsData = allGroups.filter((group) => selectedItems.some((item) => group.label === item.label));
    setParentGroups(selectedItemsData);
  };

  return (
    <GroupContentPresenter
      employees={employees}
      members={members}
      setMembers={setMembers}
      handleReset={handleReset}
      handleSubmit={handleSubmit}
      hasOfficialPermission={hasOfficialPermission}
      currentEmployeePermissions={currentEmployeePermissions}
      isCreateMode={isCreateMode}
      currentEmployeeTags={currentEmployeeTags}
      group={group}
      setGroup={setGroup}
      handleAsyncState={handleAsyncState}
      allGroups={allGroups}
      parentGroups={parentGroups}
      onSelectParentGroup={onSelectParentGroup}
      joinedParents={currentGroups}
    />
  );
};

export default GroupContentContainer;
