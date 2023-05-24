import { Box } from '@material-ui/core';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import { capitalize } from 'lodash';
import React from 'react';
import { FBCheckbox, FBEditorProperties, FBEditorProps, FBEditorState, FBEditorValidation, FBForm, FBProvider } from '..';
import { Autocomplete, FormField } from '../../components/forms/fields-next';
import Text from '../../components/Text';
import Colors from '../../layout/theme/utils/colors';
import { withFBEditor } from './FBEditor.wrap';

const styles = {
  labelProps: {
    marginBottom: 10,
    fontWeight: 600,
    fontSize: 12,
    color: Colors.almost_black,
  },
  containerProps: {
    width: '100%',
    border: '1px solid lightgrey',
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 10,
    height: 50,
    marginBottom: 15,
  },
};

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
        >
          <Autocomplete
            key={`fb-editor-auto-${type}-${index}`}
            options={tabConfig}
            onChange={handleTabSelection}
            value={capitalize(activeTabId)}
            renderOption={(option) => (<Text translation={option.labelId} />)}
            style={{ marginBottom: '15px' }}
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
