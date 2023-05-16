import { filter } from 'lodash';
import React from 'react';
import { FBAutocomplete, FBData, FBEditor, FBEditorPlaceholder, FBEditorProps, FBTextField } from '..';
import { styles as AutoCompleteStyles } from '../styles/FBAutocomplete.styles';
import { styles } from '../styles/FBEditorTextField.styles';

const FBEditorAutocomplete: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { type, index } = {},
  inputProps,
  ...props
}) => {
  const classes = styles();
  return (
    <FBEditor {...props} {...{ inputProps }}>
      <FBTextField label="form.builder.label" name="label" rules="required" className={classes.textfield}
        boxProps={{ mb: 3.125, className: classes.error }}
        labelProps={AutoCompleteStyles.labelProps}/>
      <FBEditorPlaceholder key={`fb-editor-placeholder-${type}-${index}`}
        boxProps={{ mb: 3.125, className: classes.error }}
        labelProps={AutoCompleteStyles.labelProps}
        className={classes.textfield}/>
      <FBAutocomplete
        label="form.builder.select.options"
        options={filter(FBData.autocompleteOptions, { hidden: false })}
        optionLabelKey="label"
        optionValueKey="id"
        name="optionId"
        key={`fb-editor-${type}-${index}`}
        rules="required"
        inputPropStyle={AutoCompleteStyles.inputPropStyle}
        labelProps={AutoCompleteStyles.labelProps}
        inputPropStyleSize="small"
      />
      {children}
    </FBEditor>
  );
};

export default FBEditorAutocomplete;
