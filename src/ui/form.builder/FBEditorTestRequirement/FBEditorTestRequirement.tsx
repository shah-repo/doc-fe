import React from "react";
import { FBAutocomplete, FBData, FBEditor, FBEditorProps, FBTextField } from "..";
import Text from "../../components/Text";

const FBEditorTestRequirement: React.FunctionComponent<FBEditorProps> = ({
  children,
  includeDefaultValue,
  inputProps: { type } = {},
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <Text message={`form.builder.${type}`}>
      {(defaultValue: string) => (
        <FBTextField
          label="form.builder.label"
          name="label"
          rules="required"
          {...includeDefaultValue && { defaultValue }}
        />
      )}
    </Text>
    <FBAutocomplete
      label="form.builder.testRequirement"
      name="testRequirement"
      options={FBData.requirementOptions}
      rules="required"
    />
    {children}
  </FBEditor>
);

export default FBEditorTestRequirement;
