import React from "react";
import { FBEditor, FBEditorPlaceholder, FBEditorProps, FBTextField } from "..";
import { styles as AutoCompleteStyles } from "../styles/FBAutocomplete.styles";
import { styles } from "../styles/FBEditorTextField.styles";

const FBEditorTextField: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { type } = {},
  inputProps,
  ...props
}) => {
  const classes = styles();
  return (
    <FBEditor {...props} {...{ inputProps }}>
      <FBTextField
        key={`fb-editor-field-${type}`}
        dataCy={`fb-editor-field-${type}`}
        label="form.builder.label"
        name="label"
        rules="required"
        className={classes.textfield}
        boxProps={{ mb: 3.125, className: classes.error }}
        labelProps={AutoCompleteStyles.labelProps}
      />
      <FBEditorPlaceholder
        key={`fb-editor-placeholder-${type}`}
        boxProps={{ mb: 3.125, className: classes.error }}
        labelProps={AutoCompleteStyles.labelProps}
        className={classes.textfield}
      />
      <FBTextField
        type="number"
        label="form.builder.rowNumber"
        defaultValue={1}
        name="rows"
        key={`fb-editor-${type}`}
        boxProps={{ mb: 3.125, className: classes.error }}
        labelProps={AutoCompleteStyles.labelProps}
        className={classes.textfield}
      />
      {children}
    </FBEditor>
  );
};

export default FBEditorTextField;
