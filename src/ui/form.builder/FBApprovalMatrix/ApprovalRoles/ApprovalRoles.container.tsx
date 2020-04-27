/* eslint-disable react/jsx-key */
import React from "react";
import { ApprovalRolesContainerProps } from "../FBApprovalMatrix.types";
import ApprovalRolesPresenter from "./ApprovalRoles.presenter";

const ApprovalRolesContainer: React.FunctionComponent<ApprovalRolesContainerProps> = ({
  activeEmployees,
  groupOptions,
  approvalRoles,
  handleEditRoleDetails,
  isDisabled,
  disabledSelectField,
}) => {

  const approvalRolesRenderer = () => (
    approvalRoles && approvalRoles.map((role, index) => {
      const isWithoutBorder = index === (approvalRoles.length - 1);

      return <ApprovalRolesPresenter
        key={index}
        name={role.name}
        groups={role.groups}
        employees={role.employees}
        employeeOptions={activeEmployees}
        {...{
          isDisabled,
          index,
          groupOptions,
          approvalRoles,
          handleEditRoleDetails,
          isWithoutBorder,
          disabledSelectField,
        }}
      />;
    })
  );

  return (
    <>
      {approvalRolesRenderer()}
    </>
  ); };

export default ApprovalRolesContainer;
