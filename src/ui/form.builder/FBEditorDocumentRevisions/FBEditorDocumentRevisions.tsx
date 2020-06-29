import React from "react";
import { FBEditor, FBEditorProps } from "..";

const FBEditorDocumentRevisions: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    {children}
  </FBEditor>
);

export default FBEditorDocumentRevisions;
