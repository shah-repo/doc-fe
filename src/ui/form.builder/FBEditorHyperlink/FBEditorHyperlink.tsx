import React from "react";
import { FBEditor, FBEditorProps, FBTextField } from "..";
import { styles } from "../styles/FBEditorTextField.styles";

const FBEditorHyperlink: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { type, index } = {},
  inputProps,
  ...props
}) => {
  const classes = styles();
  return (
    <FBEditor {...props} {...{ inputProps }}>
      <FBTextField label="form.builder.label" name="label" rules="required"  className={classes.textfield}
        boxProps={{ mb: 3.125, className: classes.error }}
        labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}/>
      <FBTextField
        type="url"
        label="URL"
        name="linkUrl"
        key={`fb-editor-${type}-${index}`}
        rules="required"
        className={classes.textfield}
        boxProps={{ mb: 3.125, className: classes.error }}
        labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}
      />
      {children}
    </FBEditor>
  );
};

export default FBEditorHyperlink;
