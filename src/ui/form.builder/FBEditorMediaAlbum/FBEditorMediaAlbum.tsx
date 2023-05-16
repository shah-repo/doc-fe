import React from 'react';
import { FBCheckbox, FBEditor, FBEditorProps, FBTextField } from '..';
import Text from '../../components/Text';
import { styles as AutoCompleteStyles } from '../styles/FBAutocomplete.styles';
import { styles } from '../styles/FBEditorTextField.styles';

const FBEditorMediaAlbum: React.FunctionComponent<FBEditorProps> = ({
  children,
  includeDefaultValue,
  inputProps: { type, stepIndex } = {},
  inputProps,
  ...props
}) => {
  const classes = styles();
  return (
    <FBEditor {...props} {...{ inputProps }}>
      <Text message={`form.builder.${type}`}>
        {(defaultValue: string) => (
          <FBTextField
            label="form.builder.label"
            name="label"
            rules="required"
            {...includeDefaultValue && { defaultValue }}
            className={classes.textfield}
            boxProps={{ mb: 3.125, className: classes.error }}
            labelProps={AutoCompleteStyles.labelProps}
          />
        )}
      </Text>
      <FBCheckbox
        defaultChecked={type === 'instructionsmediaupload'}
        name="isTemplate"
        hidden={true}
      />
      {children}
    </FBEditor>
  );
};

export default FBEditorMediaAlbum;
