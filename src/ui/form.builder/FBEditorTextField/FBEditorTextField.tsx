import React from "react";
import { FBEditor, FBEditorPlaceholder, FBEditorProps, FBTextField } from "..";

const FBEditorTextField: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { type } = {},
  inputProps,
  ...props
}) => (
    <FBEditor {...props} {...{ inputProps }}>
      <FBTextField key={`fb-editor-field-${type}`} dataCy={`fb-editor-field-${type}`} label="form.builder.label" name="label" rules="required" />
      <FBEditorPlaceholder key={`fb-editor-placeholder-${type}`} />
      <FBTextField
        type="number"
        label="form.builder.rowNumber"
        defaultValue={1}
        name="rows"
        key={`fb-editor-${type}`}
      />
      {children}
    </FBEditor>
  );

export default FBEditorTextField;
