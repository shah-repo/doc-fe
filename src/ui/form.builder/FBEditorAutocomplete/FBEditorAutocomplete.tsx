import React from "react";
import { FBAutocomplete, FBEditor, FBEditorPlaceholder, FBEditorProperties, FBEditorProps, FBTextField } from "..";
import autocompleteOptions from "../../../data/autocompleteOptions.json";

const FBEditorAutocomplete: React.FunctionComponent<FBEditorProps> = ({
  children,
  index,
  type,
}) => (
  <FBEditor {...{ type, index }}>
    <FBTextField label="form.builder.label" name="label" rules="required"/>
    <FBEditorPlaceholder key={`fb-editor-placeholder-${type}-${index}`} />
    <FBAutocomplete
      label="form.builder.select.options"
      options={autocompleteOptions}
      optionLabelKey="label"
      optionValueKey="id"
      name="optionId"
      key={`fb-editor-${type}-${index}`}
    />
    <FBEditorProperties key={`fb-editor-props-${type}-${index}`} {...{ type }} />
    {children}
  </FBEditor>
);

export default FBEditorAutocomplete;
