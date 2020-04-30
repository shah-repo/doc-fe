import React from "react";
import { FBEditor, FBEditorProps, FBTextField } from "..";
import Text from "../../components/Text";

const FBEditorLabel: React.FunctionComponent<FBEditorProps> = ({
  children,
  includeDefaultValue,
  inputProps: { type } = {},
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <Text message={`form.builder.${type}`}>
      {(defaultValue) => (
        <FBTextField
          label="form.builder.label"
          name="label"
          rules="required"
          {...includeDefaultValue && { defaultValue }}
        />
      )}
    </Text>
    {children}
  </FBEditor>
);

export default FBEditorLabel;
