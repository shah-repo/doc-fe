import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocomplete, FBCheckbox, FBEditorProperties, FBEditorProps, FBEditorState, FBEditorValidation, FBForm, FBProvider } from "..";
import Text from "../../components/Text";
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
  tabConfig,
  handleTabSelection,
  activeTabId,
}) => (
  <FBProvider {...{ editorState }}>
    <FBForm initialValues={inputProps} {...{ formState }}>
      <Box hidden={mode === "validation"}>
        <FBAutocomplete
          label="form.builder.select.tab"
          options={tabConfig}
          defaultValue={activeTabId}
          optionLabelKey="labelId"
          optionValueKey="tabId"
          renderOption={(option) => (<Text translation={option.labelId}></Text>)}
          name="tabId"
          key={`fb-editor-auto-${type}-${index}`}
          onChange={handleTabSelection}
          inputPropStyleSize="small"
          inputStyle={{ textTransform: "capitalize" }}
        />
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
