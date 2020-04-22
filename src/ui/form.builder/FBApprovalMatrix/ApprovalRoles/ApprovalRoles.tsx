import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import { GetEmployeeResponse, userManagementActions, userManagementSelectors } from "../../../../state/ducks/userManagement";
import { DEFAULT_ACTIVE_EMPLOYEES } from "../../../group.management/utils/types";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import FBStore from "../../stores/ui/FBStore";
import { ApprovalRole } from "../FBApprovalMatrix.types";
import AddRoleDialog from "./AddRoleDialog";
import ApprovalRolesContainer from "./ApprovalRoles.wrap";
import ApprovalRolesSectionBox from "./ApprovalRolesSectionBox";

interface Props {
  approvalRoles: ApprovalRole[];
  handleEditRoleDetails: (e, index, type) => void;
  addAnotherRole: () => void;
  handleSaveRole: (dialog) => void;
  handleCancelDialogRole: () => void;
  errorMessage: string;
  disabled: boolean;
}

const ApprovalRoles: React.FunctionComponent<Props> = ({
  approvalRoles,
  handleEditRoleDetails,
  addAnotherRole,
  handleSaveRole,
  handleCancelDialogRole,
  errorMessage,
  disabled,
}) => {
  const { document } = FBStore;
  const isDocumentReleased = document.status === DocumentRevisionStatus.Released;
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
        handleEditRoleDetails={handleEditRoleDetails}
        activeEmployees={activeEmployees}
        groupOptions={groupOptions}
        approvalRoles={approvalRoles}
      />}
      <AddRoleDialog
        isDisabled={false}
        handleEditRoleDetails={handleEditRoleDetails}
        activeEmployees={activeEmployees}
        groupOptions={groupOptions}
        onSave={handleSaveRole}
        addAnotherRole={addAnotherRole}
        approvalRoles={approvalRoles}
        handleCancelDialogRole={handleCancelDialogRole}
        errorMessage={errorMessage}
        disabled={disabled}
      />
    </>
  ); };

export default ApprovalRoles;
