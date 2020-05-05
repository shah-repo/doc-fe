import React from "react";
import { FBAutocompleteAsync, FBEditor, FBEditorProps } from "..";
import { FBEditorLabel } from "../FBEditorLabel";

const FBEditorInstructionsDocument: React.FunctionComponent<FBEditorProps> = ({
  children,
  includeDefaultValue,
  standalone = false,
  inputProps: { type } = {},
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBEditorLabel {...props} {...{ inputProps, includeDefaultValue }} standalone={true} />
    <FBAutocompleteAsync
      label="form.builder.document"
      name="instructionsDocument"
      optionId="1"
    />
    {children}
  </FBEditor>
);

export default FBEditorInstructionsDocument;
