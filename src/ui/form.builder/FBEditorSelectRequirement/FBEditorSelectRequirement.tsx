import React from "react";
import { FBAutocompleteAsync, FBData } from "..";
import FBTextField from "../components/inputs/FBTextField";
import { FBInputProps } from "../types/common";

const FBEditorSelectRequirement: React.FunctionComponent<FBInputProps> = ({
  defaultValue,
  ...props
}) => (
  <>
    <FBTextField {...props} label="form.builder.label" name="label" {...{ defaultValue }}  />
    <FBAutocompleteAsync
      label="form.builder.options"
      name="options"
      options={FBData.requirementOptions}
      multiple={true}
      optionLabelKey="text"
      optionValueKey="value"
      defaultValue={props.options}
    />
  </>
);

export default FBEditorSelectRequirement;
