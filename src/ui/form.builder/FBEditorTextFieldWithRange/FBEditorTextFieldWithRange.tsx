import React from "react";
import { FBEditor, FBEditorProps } from "..";

const FBEditorTextFieldWithRange: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    hello world
  </FBEditor>
);

export default FBEditorTextFieldWithRange;
