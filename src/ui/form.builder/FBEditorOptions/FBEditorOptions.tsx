import React from 'react';
import { FBTextField, FBTextFieldProps } from '..';
import { styles } from '../styles/FBAutocomplete.styles';

const FBEditorOptions: React.FunctionComponent<FBTextFieldProps> = ({
  label = 'form.builder.options',
  name = 'options',
  placeholder = 'form.builder.options.placeholder',
  rules = 'required',
  className,
}) => (
  <FBTextField
    {...{ label, name, placeholder, rules, className }}
    rows={5}
    multiline
    boxProps={{ mb: 3.125 }}
    labelProps={styles.labelProps}
    FBProps={{ inputType: 'editoroptions' }}
  />
);

export default FBEditorOptions;
