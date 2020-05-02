import React from "react";
import { FBAutocomplete, FBData, FBEditor, FBEditorPlaceholder, FBEditorProperties, FBEditorProps, FBTextField } from "..";

const FBEditorAutocomplete: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps: { type, index } = {},
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBTextField label="form.builder.label" name="label" rules="required"/>
    <FBEditorPlaceholder key={`fb-editor-placeholder-${type}-${index}`} />
    <FBAutocomplete
      label="form.builder.select.options"
      options={FBData.autocompleteOptions}
      optionLabelKey="label"
      optionValueKey="id"
      name="optionId"
      key={`fb-editor-${type}-${index}`}
      rules="required"
    />
    <FBEditorProperties key={`fb-editor-props-${type}-${index}`} {...{ type }} />
    {children}
  </FBEditor>
);

export default FBEditorAutocomplete;
