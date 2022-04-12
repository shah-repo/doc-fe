import React from "react";
import { FBAutocompleteAsync, FBEditor, FBEditorLabel, FBEditorProps } from "..";

const FBEditorInstructionsDocument: React.FunctionComponent<FBEditorProps> = ({
  children,
  includeDefaultValue,
  standalone = false,
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBEditorLabel {...props} {...{ inputProps, includeDefaultValue }} standalone={true} />
    <FBAutocompleteAsync
      label="form.builder.document"
      name="instructionsDocument"
      optionId="1"
      rules="required"
      inputPropStyle={ { height: 47, borderWidth: 1, borderColor: "#CCD4D9", borderRadius: 3 } }
      labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}
      inputPropStyleSize="small"
    />
    {children}
  </FBEditor>
);

export default FBEditorInstructionsDocument;
