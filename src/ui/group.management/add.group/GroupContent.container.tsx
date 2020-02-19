import { omit } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import { groupManagementActions } from "../../../state/ducks/groupManagement";
import { GroupRequestBody } from "../../../state/ducks/groupManagement/types";
import {
  GetEmployeeResponse,
  LoadCompanyGroup,

} from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import useAsync from "../../hooks/useAsync";
import { getHasOfficialPermissions } from "../utils/helpers";
import { toEmployeeIds, toMembersEditRequestBody, toMembersOptions } from "../utils/transform";
import { DEFAULT_GROUP } from "../utils/types";
import GroupContentPresenter from "./GroupContent.presenter";

interface Props {
  selectedGroup?: LoadCompanyGroup;
  isCreateMode?: boolean;
  employees: GetEmployeeResponse[];
  handleTableRefresh: () => void;
}

export const GroupContentContainer: React.FunctionComponent<Props> = ({
  selectedGroup,
  isCreateMode,
  employees,
  handleTableRefresh,
}) => {
  const [group, setGroup] = useState<GroupRequestBody>(DEFAULT_GROUP);
  const [members, setMembers] = useState<OptionType[]>([]);
  const currentEmployeePermissions = useSelector(
    authSelectors.currentEmployeePermissions,
  );
  const currentEmployeeTags = useSelector(authSelectors.currentEmployeeTags);
  const hasOfficialPermission = getHasOfficialPermissions(
    currentEmployeePermissions,
  );

  const dispatch = useDispatch();
  const createGroupAsync = useAsync({
      onSuccess: (response) => {
        handleTableRefresh();
      },
    });
  const editGroupAsync = useAsync({
    onSuccess: (response) => {
      handleTableRefresh();
    },
  });

  const handleCreateGroup = (values: GroupRequestBody) => {
    dispatch(
      groupManagementActions.createGroup(
        {...values, employees: toMembersEditRequestBody(members)},
        createGroupAsync,
      ),
    );
  };
  const handleEditGroup = (groupId: string, values: GroupRequestBody) => {
    const isGroupNameChanged = !(selectedGroup!.name === values.name);
    const body = isGroupNameChanged ?
                {...values, employees: toMembersEditRequestBody(members)} :
                omit({...values, employees: toMembersEditRequestBody(members)}, ["name"]);
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
        employees: toEmployeeIds(selectedGroup.employees),
      });
      setMembers(
        toMembersOptions(
          (selectedGroup.employees as unknown) as GetEmployeeResponse[],
        ),
      );
    }
  }, [selectedGroup]);

  const handleReset = () => {
    setGroup(DEFAULT_GROUP);
    setMembers([]);
  };

  const handleSubmit = () => {
    isCreateMode ?  handleCreateGroup(group) : handleEditGroup(selectedGroup!.id, group);
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
    />
  );
};

export default GroupContentContainer;
