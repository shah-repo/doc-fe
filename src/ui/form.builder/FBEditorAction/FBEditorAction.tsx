import React from "react";
import { FBCheckboxGroup, FBData, FBEditor, FBEditorProps } from "..";
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
        labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}
        className={classes.textfield}
      />
      {children}
    </FBEditor>
  );
};

export default FBEditorAction;
