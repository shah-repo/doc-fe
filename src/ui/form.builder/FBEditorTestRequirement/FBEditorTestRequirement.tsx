import React from "react";
import { FBAutocomplete, FBData, FBEditor, FBEditorLabel, FBEditorProps } from "..";

const FBEditorTestRequirement: React.FunctionComponent<FBEditorProps> = ({
  children,
  includeDefaultValue,
  inputProps: { type } = {},
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBEditorLabel {...props} {...{ inputProps, includeDefaultValue }} standalone={true} />
    <FBAutocomplete
      label="form.builder.testRequirement"
      name="testRequirement"
      options={FBData.requirementOptions}
      rules="required"
    />
    {children}
  </FBEditor>
);

export default FBEditorTestRequirement;
