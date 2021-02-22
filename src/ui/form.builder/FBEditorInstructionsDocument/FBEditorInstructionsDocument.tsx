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
    />
    {children}
  </FBEditor>
);

export default FBEditorInstructionsDocument;
