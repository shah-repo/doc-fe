import { Box } from "@material-ui/core";
import React from "react";
import { FBEditorProps } from ".";
import { FBEditorProperties, FBEditorValidation, FBForm, FBProvider } from "..";
import { withFBEditor } from "./FBEditor.wrap";

const FBEditor: React.FunctionComponent<FBEditorProps> = ({
  inputProps: { type, index } = {},
  inputProps,
  editorState,
  children,
  underValidation,
  mode,
}) => (
  <FBProvider {...{ editorState }}>
    <FBForm initialValues={inputProps}>
      <Box hidden={mode === "validation"}>
        {children}
        <FBEditorProperties
          key={`fb-editor-props-${type}-${index}`}
          {...{ type }}
        />
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
