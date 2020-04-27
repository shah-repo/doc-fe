import { Box } from "@material-ui/core";
import React from "react";
import { FBEditorProps } from ".";
import { FBEditorValidation, FBForm, FBProvider } from "..";
import { withFBEditor } from "./FBEditor.wrap";

const FBEditor: React.FunctionComponent<FBEditorProps> = ({
  editorState,
  children,
  initialValues,
  underValidation,
  mode,
  ...props
}) => (
  <FBProvider {...{ editorState }}>
    <FBForm {...{ initialValues }}>
      <Box hidden={mode === "validation"}>
        {children}
      </Box>
      {underValidation && (
        <Box hidden={mode === "config"}>
          <FBEditorValidation />
        </Box>
      )}
    </FBForm>
  </FBProvider>
);

export default withFBEditor(FBEditor);
