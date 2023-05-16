import React from 'react';
import { FBEditor, FBEditorProps, FBTextField } from '..';

const FBEditorCheckControl: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBTextField label="form.builder.label" name="label" rules="required"/>
    {children}
  </FBEditor>
);

export default FBEditorCheckControl;
