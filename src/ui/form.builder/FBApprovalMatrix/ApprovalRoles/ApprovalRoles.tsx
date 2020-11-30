import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FB } from "../..";
import { GetEmployeeResponse, userManagementActions, userManagementSelectors } from "../../../../state/ducks/userManagement";
import { isDocumentRevisionReleased } from "../../../documentRevision/helpers/documentRevisionStatus";
import { DEFAULT_ACTIVE_EMPLOYEES } from "../../../group.management/utils/types";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import { ApprovalRolesProps } from "../FBApprovalMatrix.types";
import AddRoleDialog from "./AddRoleDialog";
import ApprovalRolesContainer from "./ApprovalRoles.container";
import ApprovalRolesSectionBox from "./ApprovalRolesSectionBox";

const ApprovalRoles: React.FunctionComponent<ApprovalRolesProps> = ({
  approvalRoles,
  handleEditRoleDetails,
  addAnotherRole,
  handleSaveRole,
  handleCancelDialogRole,
  errorMessage,
  disabled,
}) => {
  const { workspaceState } = FB.useStores();
  const { document } = workspaceState || {};
  const isDocumentReleased = isDocumentRevisionReleased(document?.status);
  const [activeEmployees, setActiveEmployees] = useState<GetEmployeeResponse[]>(
    DEFAULT_ACTIVE_EMPLOYEES,
  );
  const getEmployeeAction = useActionCreator(userManagementActions.getEmployee);
  const asyncGetActiveEmployees = useAsync<GetEmployeeResponse[]>({
    onSuccess: (data: GetEmployeeResponse[] = []) => {
      setActiveEmployees(data);
    },
  });
  const groupOptions = useSelector(userManagementSelectors.getOfficialGroups);

  useEffect(() => {
    if (disabled && !isDocumentReleased) {
      return;
    }
    asyncGetActiveEmployees.start(getEmployeeAction, { active: true }, asyncGetActiveEmployees);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, isDocumentReleased]);
  return (
    <>
      <ApprovalRolesSectionBox/>
      {approvalRoles && <ApprovalRolesContainer
        isDisabled={true}
        disabledSelectField={disabled}
        {...{ handleEditRoleDetails, activeEmployees, groupOptions, approvalRoles }}
      />}
      <AddRoleDialog
        isDisabled={false}
        onSave={handleSaveRole}
        {...{
          activeEmployees,
          groupOptions,
          disabled,
          errorMessage,
          approvalRoles,
          handleCancelDialogRole,
          addAnotherRole,
          handleEditRoleDetails,
        }}
      />
    </>);
};

export default ApprovalRoles;
