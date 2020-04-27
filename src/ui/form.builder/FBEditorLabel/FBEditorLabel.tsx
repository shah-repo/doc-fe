import React from "react";
import { FBEditor, FBEditorLabelProps, FBTextField } from "..";
import Text from "../../components/Text";

const FBEditorLabel: React.FunctionComponent<FBEditorLabelProps> = ({
  children,
  includeDefaultValue,
  type,
  ...props
}) => (
  <FBEditor {...props} {...{ includeDefaultValue, type }}>
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
