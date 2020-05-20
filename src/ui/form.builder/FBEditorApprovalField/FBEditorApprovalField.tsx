import React from "react";
import { FBAutocompleteAsync, FBEditorApprovalFieldProps } from "..";
import FBCheckboxGroup from "../components/inputs/FBCheckboxGroup";
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
      defaultValue={approvers}
    />
    <FBAutocompleteAsync
      label="form.builder.approver.groups"
      optionId="10"
      name="approverGroups"
      multiple={true}
      defaultValue={approverGroups}
    />
    <FBCheckboxGroup
      name="editor-additions"
      label="form.builder.additions"
      options={[
        { value: "approveIsBlocking", text: "form.builder.blocking" },
        { value: "reviseDisabled", text: "form.builder.revise.disabled" },
      ]}
    />
  </>
);

export default FBEditorApprovalField;
