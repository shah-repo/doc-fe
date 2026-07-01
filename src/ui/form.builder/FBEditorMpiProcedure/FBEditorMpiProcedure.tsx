import React from 'react';
import { FBCheckbox, FBEditor, FBEditorProps } from '..';

const FBEditorMpiProcedure: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBCheckbox
      label="form.builder.skip.serialization"
      name="editorConfig.shouldSkipSerialization"
    />
    {children}
  </FBEditor>
);

export default FBEditorMpiProcedure;
