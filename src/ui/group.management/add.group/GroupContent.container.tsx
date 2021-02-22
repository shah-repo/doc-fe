import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Group, Permission } from "../../../state/ducks/auth/types";
import { groupManagementActions } from "../../../state/ducks/groupManagement";
import { GroupRequestBody } from "../../../state/ducks/groupManagement/types";
import { GetEmployeeResponse, LoadCompanyGroup } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import useAsync from "../../hooks/useAsync";
import { toEditRequestBody, toGroupOptions, toMembersOptions, toParentOptions, toRequestBody } from "../utils/transform";
import { DEFAULT_GROUP } from "../utils/types";
import GroupContentPresenter from "./GroupContent.presenter";

interface Props {
  selectedGroup?: LoadCompanyGroup;
  isCreateMode?: boolean;
  employees: GetEmployeeResponse[];
  handleTableRefresh: () => void;
  closeDialog: () => void;
  currentEmployeePermissions: Permission[];
  hasOfficialPermission: boolean;
}

const GroupContentContainer: React.FunctionComponent<Props> = ({
  selectedGroup,
  isCreateMode,
  employees,
  handleTableRefresh,
  closeDialog,
  currentEmployeePermissions,
  hasOfficialPermission,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [group, setGroup] = useState<GroupRequestBody>(DEFAULT_GROUP);
  const [members, setMembers] = useState<OptionType[]>([]);
  const [parentGroups, setParentGroups] = useState<OptionType[]>([]);

  const canCreateOfficialGroup = hasOfficialPermission && group.isOfficial;

  useEffect(() => {
    if (selectedGroup) {
      setGroup(toGroupOptions(selectedGroup));
      setMembers(toMembersOptions(
        (selectedGroup.employees.filter((e) => e.active) as unknown) as GetEmployeeResponse[])
      );
      setParentGroups(toParentOptions((selectedGroup.parents as unknown) as Group[]));
    }
  }, [selectedGroup]);

  // this is a hack for back button to redirect to group management table
  useEffect(() => () => {
    history.goForward();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createGroupAsync = useAsync({
    onSuccess: (response) => {
      handleTableRefresh();
      handleReset();
    },
  });

  const editGroupAsync = useAsync({
    onSuccess: (response) => {
      handleTableRefresh();
      closeDialog();
    },
  });

  const handleAsyncState = () => isCreateMode ? createGroupAsync.asyncState : editGroupAsync.asyncState;

  const handleCreateGroup = (values: GroupRequestBody) => {
    dispatch(
      groupManagementActions.createGroup(
        toRequestBody(values, members, parentGroups),
        createGroupAsync,
      ),
    );
  };

  const handleEditGroup = (groupId: string, values: GroupRequestBody) => {
    const isGroupNameChanged = !(selectedGroup && (selectedGroup.name === values.name));
    dispatch(
      groupManagementActions.editGroup(
        groupId,
        toEditRequestBody(isGroupNameChanged, values, members, parentGroups),
        editGroupAsync,
      ),
    );
  };

  const handleReset = () => {
    setGroup(DEFAULT_GROUP);
    setParentGroups([]);
    setMembers([]);
  };

  const handleSubmit = () => {
    isCreateMode ?  handleCreateGroup(group) : (selectedGroup && handleEditGroup(selectedGroup.id, group));
  };

  return (
    <GroupContentPresenter
      employees={employees}
      members={members}
      setMembers={setMembers}
      isCreateMode={isCreateMode}
      group={group}
      setGroup={setGroup}
      handleAsyncState={handleAsyncState}
      hasOfficialPermission={hasOfficialPermission}
      currentEmployeePermissions={currentEmployeePermissions}
      canCreateOfficialGroup={canCreateOfficialGroup}
      parentGroups={parentGroups}
      setParentGroups={setParentGroups}
      handleReset={handleReset}
      handleSubmit={handleSubmit}
    />
  );
};

export default GroupContentContainer;
