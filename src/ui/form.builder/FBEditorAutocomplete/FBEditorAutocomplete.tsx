import { filter } from "lodash";
import React from "react";
import { FBAutocomplete, FBData, FBEditor, FBEditorPlaceholder, FBEditorProps, FBTextField } from "..";
import Colors from "../../layout/theme/utils/colors";
import { styles } from "../styles/FBEditorTextField.styles";

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
        labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}/>
      <FBEditorPlaceholder key={`fb-editor-placeholder-${type}-${index}`}
        labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}
        className={classes.textfield}/>
      <FBAutocomplete
        label="form.builder.select.options"
        options={filter(FBData.autocompleteOptions, { hidden: false })}
        optionLabelKey="label"
        optionValueKey="id"
        name="optionId"
        key={`fb-editor-${type}-${index}`}
        rules="required"
        inputPropStyle={{ height: 40, background: Colors.white, border: `1px solid ${Colors.gray_goose}`, borderRadius: 3 }}
        labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}
        inputPropStyleSize="small"
      />
      {children}
    </FBEditor>
  );
};

export default FBEditorAutocomplete;
