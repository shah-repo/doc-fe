import React from "react";
import { FBCheckboxGroup, FBData, FBEditor, FBEditorProps } from "..";

const FBEditorAction: React.FunctionComponent<FBEditorProps> = ({
  children,
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBCheckboxGroup
      name="actions"
      label="form.builder.actions"
      options={FBData.actionOptions}
      optionValueKey="name"
      optionLabelKey="description"
    />
    {children}
  </FBEditor>
);

export default FBEditorAction;
