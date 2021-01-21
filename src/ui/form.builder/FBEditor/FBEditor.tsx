import { Box } from "@material-ui/core";
import React from "react";
import { FBEditorProps, FBEditorState } from ".";
import { FBCheckbox, FBEditorProperties, FBEditorValidation, FBForm, FBProvider } from "..";
import { withFBEditor } from "./FBEditor.wrap";

const FBEditor: React.FunctionComponent<FBEditorProps> = ({
  formState,
  inputProps: { type, index } = {},
  inputProps,
  editorState,
  children,
  underValidation,
  isFormOutput,
  mode,
}) => (
  <FBProvider {...{ editorState }}>
    <FBForm initialValues={inputProps} {...{ formState }}>
      <Box hidden={mode === "validation"}>
        {children}
        {type && FBEditorState.omitFinalValidation.includes(type) && (
          <FBCheckbox name="omitFinalValidation" hidden={true} defaultChecked={true} />
        )}
        {!isFormOutput && (
          <FBEditorProperties
            key={`fb-editor-props-${type}-${index}`}
            {...{ type, inputProps }}
          />
        )}
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
