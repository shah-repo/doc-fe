import React from "react";
import { FBCheckboxGroup, FBData, FBEditor, FBEditorProps } from "..";
import { styles as AutoCompleteStyles } from "../styles/FBAutocomplete.styles";
import { styles } from "../styles/FBEditorTextField.styles";

const FBEditorAction: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps,
  ...props
}) => {
  const classes = styles();
  return (
    <FBEditor {...props} {...{ inputProps }}>
      <FBCheckboxGroup
        name="actions"
        label="form.builder.actions"
        options={FBData.actionOptions}
        optionValueKey="name"
        optionLabelKey="description"
        rules="required"
        boxProps={{ mb: 3.125, className: classes.error }}
        labelProps={AutoCompleteStyles.labelProps}
        className={classes.textfield}
      />
      {children}
    </FBEditor>
  );
};

export default FBEditorAction;
