import React from "react";
import { FBAutocompleteAsync, FBEditorApprovalFieldProps } from "..";
import FBCheckbox from "../components/inputs/FBCheckbox";
import FBTextField from "../components/inputs/FBTextField";

const FBEditorApprovalField: React.FunctionComponent<FBEditorApprovalFieldProps> = ({
  approverGroups,
  approvers,
  includeLabel = true,
  ...props
}) => (
  <>
    {includeLabel && <FBTextField label="form.builder.label" name="label" {...props} />}
    <FBAutocompleteAsync
      label="common.approvers"
      optionId="3"
      name="approvers"
      multiple={true}
      optionValueType="object"
      optionObjectKeys={["id", "groups", "user.id", "user.email", "user.name"]}
      defaultValue={approvers}
    />
    <FBAutocompleteAsync
      label="form.builder.approver.groups"
      optionId="10"
      name="approverGroups"
      multiple={true}
      optionValueType="object"
      optionObjectKeys={["id", "name"]}
      defaultValue={approverGroups}
    />
    <FBCheckbox name="approveIsBlocking" label="form.builder.blocking" />
  </>
);

export default FBEditorApprovalField;
