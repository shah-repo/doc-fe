import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetEmployeeResponse, userManagementActions, userManagementSelectors } from "../../../../state/ducks/userManagement";
import { DEFAULT_ACTIVE_EMPLOYEES } from "../../../group.management/utils/types";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import AddRoleDialog from "./AddRoleDialog";
import ApprovalRolesContainer from "./ApprovalRoles.container";
import ApprovalRolesSectionBox from "./ApprovalRolesSectionBox";

const ApprovalRoles: React.FunctionComponent = () => {
  const [activeEmployees, setActiveEmployees] = useState<GetEmployeeResponse[]>(
    DEFAULT_ACTIVE_EMPLOYEES,
  );
  const getEmployeeAction = useActionCreator(userManagementActions.getEmployee);
  const asyncGetActiveEmployees = useAsync<GetEmployeeResponse[]>({
    onSuccess: (data: GetEmployeeResponse[] = []) => {
      setActiveEmployees(data);
    },
  });
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);

  useEffect(() => {
    asyncGetActiveEmployees.start(getEmployeeAction, { active: true }, asyncGetActiveEmployees);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ApprovalRolesSectionBox/>
      <ApprovalRolesContainer
        activeEmployees={activeEmployees}
        groupOptions={groupOptions}
      />
      <AddRoleDialog
        activeEmployees={activeEmployees}
        groupOptions={groupOptions}
        // change to function for save
        onClick={() => { return; }}
      />
    </>
  ); };

export default ApprovalRoles;
