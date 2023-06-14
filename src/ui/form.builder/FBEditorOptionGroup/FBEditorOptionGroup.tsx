import React from 'react';
import { FBEditor, FBEditorOptions, FBEditorPlaceholder, FBEditorProps, FBTextField } from '..';
import { styles as AutoCompleteStyles } from '../styles/FBAutocomplete.styles';
import { editorOptionStyles } from '../styles/FBEditorOptions.styles';
import { styles } from '../styles/FBEditorTextField.styles';

const FBEditorOptionGroup: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { type, index } = {},
  inputProps,
  ...props
}) => {
  const classes = styles();
  const editorOptionClasses = editorOptionStyles();
  return (
    <FBEditor {...props} {...{ inputProps }}>
      <FBTextField label="form.builder.label" name="label" rules="required"
        className={classes.textfield}
        boxProps={{ mb: 3.125, className: classes.error }}
        labelProps={AutoCompleteStyles.labelProps} />
      {type === 'select' && (
        <FBEditorPlaceholder key={`fb-editor-placeholder-${type}`}
          boxProps={{ mb: 3.125, className: classes.error }}
          labelProps={AutoCompleteStyles.labelProps}
          className={classes.textfield} />
      )}
      <FBEditorOptions key={`fb-editor-options-${type}-${index}`} className={editorOptionClasses.textfield} />
      {children}
    </FBEditor>
  ); };

export default FBEditorOptionGroup;
