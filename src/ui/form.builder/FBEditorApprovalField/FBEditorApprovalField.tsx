import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBEditor, FBEditorApprovalFieldProps } from "..";

const FBEditorApprovalField: React.FunctionComponent<FBEditorApprovalFieldProps> = ({
  approverGroups,
  approvalRoles,
  approvers,
  includeLabel = true,
  children,
  inputProps,
  includeDefaultValue,
  standalone = false,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBAutocompleteAsync
      label="common.approvers"
      optionId="3"
      name="approvers"
      multiple={true}
      defaultValue={approvers}
      rules="required_without_all:approverGroups,approvalRoles"
    />
    <FBAutocompleteAsync
      label="form.builder.approver.groups"
      optionId="10"
      name="approverGroups"
      multiple={true}
      defaultValue={approverGroups}
      rules="required_without_all:approvers,approvalRoles"
    />
    <FBAutocompleteAsync
      label="form.builder.approval.roles"
      optionId={FBAutocompleteAsyncOption.approvalRoles}
      name="approvalRoles"
      multiple={true}
      defaultValue={approvalRoles}
      rules="required_without_all:approvers,approverGroups"
    />
    {children}
  </FBEditor>
);

export default FBEditorApprovalField;
