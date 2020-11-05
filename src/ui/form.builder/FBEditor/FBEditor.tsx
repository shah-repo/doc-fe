import { Box } from "@material-ui/core";
import React from "react";
import { FBEditorProps, FBEditorState } from ".";
import { FBCheckbox, FBEditorProperties, FBEditorValidation, FBForm, FBProvider } from "..";
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
        {type && FBEditorState.omitFinalValidation.includes(type) && (
          <FBCheckbox name="omitFinalValidation" hidden={true} defaultChecked={true} />
        )}
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
