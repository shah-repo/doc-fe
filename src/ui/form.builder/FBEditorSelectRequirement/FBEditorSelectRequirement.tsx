import React from "react";
import { FBAutocompleteAsync } from "..";
import requirementsOptions from "../../../data/requirementsOptions.json";
import FBCheckboxGroup from "../components/inputs/FBCheckboxGroup";
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
      options={requirementsOptions}
      multiple={true}
      optionLabelKey="text"
      optionValueKey="value"
      defaultValue={props.options}
    />
    <FBCheckboxGroup
      name="editor-additions"
      label="form.builder.additions"
      options={[
        { value: "reviseDisabled", text: "form.builder.revise.disabled" },
      ]}
    />
  </>
);

export default FBEditorSelectRequirement;
