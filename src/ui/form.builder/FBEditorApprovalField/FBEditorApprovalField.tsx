import React from "react";
import { FBAutocompleteAsync, FBEditor, FBEditorApprovalFieldProps, FBEditorLabel, FBEditorProperties } from "..";

const FBEditorApprovalField: React.FunctionComponent<FBEditorApprovalFieldProps> = ({
  approverGroups,
  approvers,
  includeLabel = true,
  children,
  inputProps,
  includeDefaultValue,
  standalone = false,
  inputProps: { type, index } = {},
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    {includeLabel && (
      <FBEditorLabel {...props} {...{ inputProps, includeDefaultValue }} standalone={true} />
    )}
    <FBAutocompleteAsync
      label="common.approvers"
      optionId="3"
      name="approvers"
      multiple={true}
      defaultValue={approvers}
      rules="required_without:approverGroups"
    />
    <FBAutocompleteAsync
      label="form.builder.approver.groups"
      optionId="10"
      name="approverGroups"
      multiple={true}
      defaultValue={approverGroups}
      rules="required_without:approvers"
    />
    <FBEditorProperties key={`fb-editor-props-${type}-${index}`} type="approval" />
    {children}
  </FBEditor>
);

export default FBEditorApprovalField;
