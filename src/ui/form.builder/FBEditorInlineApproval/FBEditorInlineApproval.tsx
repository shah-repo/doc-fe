import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBEditor, FBEditorProps, FBInlineApprovalValue, FBTextField } from "..";

const FBEditorInlineApproval: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { defaultValue } = {},
  inputProps,
  includeDefaultValue,
  standalone = false,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBTextField
      label="form.builder.label"
      name="label"
      rules="required"
    />
    <FBAutocompleteAsync
      label="common.approvers"
      optionId={FBAutocompleteAsyncOption.availableApprovers}
      name="editorConfig.approvers"
      multiple={true}
      defaultValue={(defaultValue as FBInlineApprovalValue)?.approvers}
      rules="required_without_all:editorConfig.groups,editorConfig.roles"
    />
    <FBAutocompleteAsync
      label="form.builder.approver.groups"
      optionId={FBAutocompleteAsyncOption.groups}
      name="editorConfig.groups"
      multiple={true}
      defaultValue={(defaultValue as FBInlineApprovalValue)?.groups}
      rules="required_without_all:editorConfig.approvers,editorConfig.roles"
    />
    <FBAutocompleteAsync
      label="form.builder.approval.roles"
      optionId={FBAutocompleteAsyncOption.approvalRoles}
      name="editorConfig.roles"
      multiple={true}
      defaultValue={(defaultValue as FBInlineApprovalValue)?.roles}
      rules="required_without_all:editorConfig.approvers,editorConfig.groups"
    />
    {children}
  </FBEditor>
);

export default FBEditorInlineApproval;
