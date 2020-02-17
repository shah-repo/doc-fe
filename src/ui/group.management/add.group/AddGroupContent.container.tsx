import React, { useEffect, useState } from "react";
import {
  GetEmployeeResponse,
  LoadCompanyGroup,
  userManagementActions,
} from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { transformToEmployeesOptions } from "../utils/transform";
import { DEFAULT_ACTIVE_EMPLOYEE } from "../utils/types";
import AddGroupContentPresenter from "./AddGroupContent.presenter";

interface Props {
  selectedGroup?: LoadCompanyGroup;
}

export const AddGroupContentContainer: React.FunctionComponent<Props> = ({
  selectedGroup,
}) => {
  const [groupName, setGroupName] = useState<string>("");
  const [members, setMembers] = useState<OptionType[]>([]);
  const [activeEmployees, setActiveEmployees] = useState<GetEmployeeResponse[]>(
    DEFAULT_ACTIVE_EMPLOYEE,
  );
  const getEmployeeAction = useActionCreator(userManagementActions.getEmployee);
  const asyncGetActiveEmployees = useAsync<GetEmployeeResponse[]>({
    onSuccess: (data: GetEmployeeResponse[] = []) => {
      setActiveEmployees(data);
    },
  });
  useEffect(() => {
    asyncGetActiveEmployees.start(
      getEmployeeAction,
      { active: true },
      asyncGetActiveEmployees,
    );
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      setGroupName(selectedGroup.name);
      setMembers(
        transformToEmployeesOptions(
          (selectedGroup.employees as unknown) as GetEmployeeResponse[],
        ),
      );
    }
  }, [selectedGroup]);
  const handleGroupNameChange = (
    event: React.ChangeEvent<{ value: string }>,
  ) => {
    setGroupName(event.target.value);
  };
  const handleMembersChange = (state: any) => {
    setMembers(state);
  };
  const handleReset = () => {
    setGroupName("");
    setMembers([]);
  };
  const handleSubmit = () => {
    // should call handleReset onSuccess
    handleReset();
    return;
  };

  return (
    <AddGroupContentPresenter
      employees={activeEmployees}
      groupName={groupName}
      members={members}
      handleGroupNameChange={handleGroupNameChange}
      handleMembersChange={handleMembersChange}
      handleReset={handleReset}
      handleSubmit={handleSubmit}
    />
  );
};

export default AddGroupContentContainer;
