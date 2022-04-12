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
      inputPropStyle={ { height: 47, borderWidth: 1, borderColor: "#CCD4D9", borderRadius: "3px" } }
      labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}
      inputPropStyleSize="small"
    />
    {children}
  </FBEditor>
);

export default FBEditorSelectDocument;
