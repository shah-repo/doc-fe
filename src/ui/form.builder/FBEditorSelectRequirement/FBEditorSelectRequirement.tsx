import React from "react";
import { FBAutocompleteAsync, FBData, FBEditor, FBEditorLabel, FBEditorProps } from "..";

const FBEditorSelectRequirement: React.FunctionComponent<FBEditorProps> = ({
  children,
  includeDefaultValue,
  standalone = false,
  inputProps,
  inputProps: { options } = {},
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBEditorLabel {...props} {...{ inputProps, includeDefaultValue }} standalone={true} />
    <FBAutocompleteAsync
      label="form.builder.options"
      name="options"
      options={FBData.requirementOptions}
      multiple={true}
      optionLabelKey="text"
      optionValueKey="value"
      defaultValue={options}
      rules="required"
    />
    {children}
  </FBEditor>
);

export default FBEditorSelectRequirement;
