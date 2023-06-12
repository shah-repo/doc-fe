import React from 'react';
import { FBEditor, FBEditorOptions, FBEditorProps, FBTextField } from '..';
import { styles as AutoCompleteStyles } from '../styles/FBAutocomplete.styles';
import { editorOptionStyles } from '../styles/FBEditorOptions.styles';
import { styles } from '../styles/FBEditorTextField.styles';

const FBEditorTextEditor: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { type } = {},
  inputProps,
  ...props
}) => {
  const classes = styles();
  const editorOptionClasses = editorOptionStyles();
  return (
    <FBEditor {...props} {...{ inputProps }}>
      <FBTextField
        label="form.builder.label"
        name="label"
        rules="required"
        className={classes.textfield}
        boxProps={{ mb: 3.125, className: classes.error }}
        labelProps={AutoCompleteStyles.labelProps}
      />
      <FBEditorOptions
        key={`fb-editor-options-${type}`}
        label="form.builder.description.options"
        placeholder="form.builder.description.options.placeholder"
        className={editorOptionClasses.textfield}
        rules=""
      />
      {children}
    </FBEditor>
  );
};

export default FBEditorTextEditor;
