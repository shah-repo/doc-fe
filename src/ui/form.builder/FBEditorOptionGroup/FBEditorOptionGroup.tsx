import React from "react";
import { FBEditor, FBEditorOptions, FBEditorPlaceholder, FBEditorProps, FBTextField } from "..";
import { editorOptionStyles } from "../styles/FBEditorOptions.styles";
import { styles } from "../styles/FBEditorTextField.styles";

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
        labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}/>
      {type === "select" && (
        <FBEditorPlaceholder key={`fb-editor-placeholder-${type}`}
          boxProps={{ mb: 3.125, className: classes.error }}
          labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}
          className={classes.textfield}/>
      )}
      <FBEditorOptions key={`fb-editor-options-${type}-${index}`} className={editorOptionClasses.textfield}/>
      {children}
    </FBEditor>
  ); };

export default FBEditorOptionGroup;
