import React from "react";
import { FBAutocomplete } from "..";
import FBCheckbox from "../components/inputs/FBCheckbox";
import FBTextField from "../components/inputs/FBTextField";
import { FBInputProps } from "../types/common";

export type FBEditorApprovalFieldProps = Pick<FBInputProps, "defaultValue" | "approverGroups" | "approvers">;

const FBEditorApprovalField: React.FunctionComponent<FBEditorApprovalFieldProps> = ({
  approverGroups,
  approvers,
  ...props
}) => (
  <>
    <FBTextField label="form.builder.label" name="label" {...props}  />
    <FBAutocomplete
      label="common.approvers"
      optionId="3"
      name="approvers"
      multiple={true}
      valueType="object"
      optionObjectKeys={["id", "groups", "user.id", "user.email", "user.name"]}
      defaultValue={approvers}
    />
    <FBAutocomplete
      label="form.builder.approver.groups"
      optionId="10"
      name="approverGroups"
      multiple={true}
      valueType="object"
      optionObjectKeys={["id", "name"]}
      defaultValue={approverGroups}
    />
    <FBCheckbox name="approveIsBlocking" label="form.builder.blocking" />
  </>
);

export default FBEditorApprovalField;
