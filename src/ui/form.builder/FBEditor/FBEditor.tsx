import { Box, TextField, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { capitalize } from 'lodash';
import React from 'react';
import { FBCheckbox, FBEditorProperties, FBEditorProps, FBEditorState, FBEditorValidation, FBForm, FBProvider } from '..';
import Text from '../../components/Text';
import Colors from '../../layout/theme/utils/colors';
import { withFBEditor } from './FBEditor.wrap';

export const styles = {
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
        <Typography variant="h5" style={styles.labelProps}>
          <Text translation="form.builder.select.tab" />
        </Typography>
        <Autocomplete
          key={`fb-editor-auto-${type}-${index}`}
          options={tabConfig?.filter(value => value.tabId !== activeTabId)}
          onChange={handleTabSelection}
          filterSelectedOptions={true}
          value={capitalize(activeTabId)}
          renderOption={(option) => (<Text translation={option.labelId} />)}
          renderInput={(params) => <TextField {...params}
            fullWidth
            InputProps={{ ...params.InputProps, disableUnderline: true }} /> }
          style={styles.containerProps}
        />
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
