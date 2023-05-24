import { Box } from '@material-ui/core';
import { capitalize } from 'lodash';
import React from 'react';
import { FBCheckbox, FBEditorProperties, FBEditorProps, FBEditorState, FBEditorValidation, FBForm, FBProvider } from '..';
import { Autocomplete, FormField } from '../../components/forms/fields-next';
import Text from '../../components/Text';
import { withFBEditor } from './FBEditor.wrap';

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
      <Box hidden={mode === 'validation'}>
        <FormField
          label="form.builder.select.tab"
          margin="dense"
        >
          <Autocomplete
            blurOnSelect
            key={`fb-editor-auto-${type}-${index}`}
            options={tabConfig}
            onChange={handleTabSelection}
            value={capitalize(activeTabId)}
            renderOption={(option) => (<Text translation={option.labelId} />)}
          />
        </FormField>
      </Box>
      <Box hidden={mode === 'validation'}>
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
        <Box hidden={mode === 'config'}>
          <FBEditorValidation />
        </Box>
      )}
    </FBForm>
  </FBProvider>
);

export default withFBEditor(FBEditor);
