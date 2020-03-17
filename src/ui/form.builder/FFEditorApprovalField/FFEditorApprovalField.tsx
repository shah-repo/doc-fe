import React from "react";
import { FBAutocomplete } from "..";
import FBTextField from "../components/inputs/FBTextField";
import { FBInputProps } from "../types/common";

const FBEditorApprovalField: React.FunctionComponent<Pick<FBInputProps, "defaultValue">> = ({
  ...props
}) => (
  <>
    <FBTextField label="form.builder.label" name="label" {...props}  />
    <FBAutocomplete
      label="Approvers"
      optionId="3"
      name="approvers"
      multiple={true}
      valueType="object"
    />
  </>
);

export default FBEditorApprovalField;
