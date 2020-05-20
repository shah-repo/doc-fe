import React from "react";
import { FBAutocompleteAsync, FBEditor, FBEditorLabel, FBEditorProps } from "..";

const FBEditorSelectDocument: React.FunctionComponent<FBEditorProps> = ({
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
      optionId="1"
      multiple={true}
      defaultValue={options}
      rules="required"
    />
    {children}
  </FBEditor>
);

export default FBEditorSelectDocument;
