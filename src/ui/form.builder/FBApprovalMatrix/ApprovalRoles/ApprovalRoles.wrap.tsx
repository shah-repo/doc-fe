/* eslint-disable react/jsx-key */
import React from "react";
import { ApprovalRole } from "../FBApprovalMatrix.types";
import ApprovalRolesPresenter from "./ApprovalRoles.presenter";

interface Props {
  activeEmployees: any;
  groupOptions: any;
  approvalRoles: ApprovalRole[];
  handleEditRoleDetails: (e, index, type) => void;
  isDisabled: boolean;
}
const ApprovalRolesContainer: React.FunctionComponent<Props> = ({
  activeEmployees,
  groupOptions,
  approvalRoles,
  handleEditRoleDetails,
  isDisabled,
}) => {

  const approvalRolesRenderer = () => (
    approvalRoles && approvalRoles.map((role, index) => {
      const isWithoutBorder = index === (approvalRoles.length - 1);

      return <ApprovalRolesPresenter
        key={index}
        handleEditRoleDetails={handleEditRoleDetails}
        isDisabled={isDisabled}
        index={index}
        name={role.name}
        groups={role.groups}
        employees={role.employees}
        employeeOptions={activeEmployees}
        groupOptions={groupOptions}
        isWithoutBorder={isWithoutBorder}
      />;
    })
  );

  return (
    <>
      {approvalRolesRenderer()}
    </>
  ); };

export default ApprovalRolesContainer;
