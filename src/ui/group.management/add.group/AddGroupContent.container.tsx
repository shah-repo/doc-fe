import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import {
  GetEmployeeResponse,
  LoadCompanyGroup,
} from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { getHasOfficialPermissions } from "../utils/helpers";
import { transformToEmployeesOptions } from "../utils/transform";
import { DEFAULT_GROUP, GroupRequestBody } from "../utils/types";
import AddGroupContentPresenter from "./AddGroupContent.presenter";

interface Props {
  selectedGroup?: LoadCompanyGroup;
  isCreateMode?: boolean;
  employees: GetEmployeeResponse[];
}

export const AddGroupContentContainer: React.FunctionComponent<Props> = ({
  selectedGroup,
  isCreateMode,
  employees,
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

  useEffect(() => {
    if (selectedGroup) {
      setGroup({
        name: selectedGroup.name,
        permissions: selectedGroup.permissions,
        defaultForNewUsers: selectedGroup.defaultForNewUsers,
        isOfficial: selectedGroup.isOfficial,
        tags: selectedGroup.tags || [],
      });
      setMembers(
        transformToEmployeesOptions(
          (selectedGroup.employees as unknown) as GetEmployeeResponse[],
        ),
      );
    }
  }, [selectedGroup]);

  // handle actions
  const handleReset = () => {
    setGroup(DEFAULT_GROUP);
    setMembers([]);
  };

  const handleSubmit = () => {
    // should call handleReset onSuccess
    handleReset();
    return;
  };
  console.log(group);

  return (
    <AddGroupContentPresenter
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

export default AddGroupContentContainer;
