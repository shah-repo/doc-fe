import { Box } from "@material-ui/core";
import React from "react";
import { FBEditorProps } from ".";
import { FBEditorValidation, FBForm, FBProvider } from "..";
import { withFBEditor } from "./FBEditor.wrap";

const FBEditor: React.FunctionComponent<FBEditorProps> = ({
  editorState,
  children,
  initialValues,
  mode,
}) => (
  <FBProvider {...{ editorState }}>
    <FBForm {...{ initialValues }}>
      {/* {mode === "config" && children}
      {mode === "validation" && <FBEditorValidation />} */}
      <Box hidden={mode === "validation"}>
        {children}
      </Box>
      <Box hidden={mode === "config"}>
        <FBEditorValidation />
      </Box>
    </FBForm>
  </FBProvider>
);

export default withFBEditor(FBEditor);
