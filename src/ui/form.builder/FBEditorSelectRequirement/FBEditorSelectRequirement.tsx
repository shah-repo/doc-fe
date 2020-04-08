import React from "react";
import { FBAutocompleteAsync } from "..";
import requirementsOptions from "../../../data/requirementsOptions.json";
import FBTextField from "../components/inputs/FBTextField";
import { FBInputProps } from "../types/common";

const FBEditorSelectRequirement: React.FunctionComponent<FBInputProps> = ({
  defaultValue,
  ...props
}) => (
  <>
    <FBTextField label="form.builder.label" name="label" {...props} {...{ defaultValue }}  />
    <FBAutocompleteAsync
      label="form.builder.options"
      name="options"
      options={requirementsOptions}
      multiple={true}
      optionLabelKey="text"
      optionValueKey="value"
    />
  </>
);

export default FBEditorSelectRequirement;
