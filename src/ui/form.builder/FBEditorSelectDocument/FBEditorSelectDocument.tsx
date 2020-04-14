import React from "react";
import { FBAutocompleteAsync } from "..";
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
  </>
);

export default FBEditorSelectDocument;
