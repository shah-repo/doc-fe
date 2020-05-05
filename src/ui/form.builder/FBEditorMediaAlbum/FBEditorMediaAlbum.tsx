import React from "react";
import { FBCheckbox, FBEditor, FBEditorProps, FBTextField } from "..";
import Text from "../../components/Text";

const FBEditorMediaAlbum: React.FunctionComponent<FBEditorProps> = ({
  children,
  includeDefaultValue,
  inputProps: { type, stepIndex } = {},
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
    <FBCheckbox
      defaultChecked={type === "instructionsmediaupload"}
      name="isTemplate"
      hidden={true}
    />
    {children}
  </FBEditor>
);

export default FBEditorMediaAlbum;
