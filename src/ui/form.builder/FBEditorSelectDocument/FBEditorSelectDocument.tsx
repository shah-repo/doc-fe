import React from "react";
import { FBAutocompleteAsync } from "..";
import FBCheckboxGroup from "../components/inputs/FBCheckboxGroup";
import FBTextField from "../components/inputs/FBTextField";
import { FBInputProps } from "../types/common";

const FBEditorSelectDocument: React.FunctionComponent<FBInputProps> = ({
  defaultValue,
  ...props
}) => (
  <>
    <FBTextField {...props} label="form.builder.label" name="label" {...{ defaultValue }}  />
    <FBAutocompleteAsync
      label="form.builder.options"
      name="options"
      optionId="1"
      multiple={true}
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

export default FBEditorSelectDocument;
