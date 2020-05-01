import { InputAdornment } from "@material-ui/core";
import React from "react";
import { FBEditor, FBEditorProps, FBInput, FBTextField } from "..";
import Text from "../../components/Text";

const FBEditorLabel: React.FunctionComponent<FBEditorProps> = ({
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
          {...stepIndex && {
            InputProps: {
              endAdornment: (
                <InputAdornment position="end">
                  <FBInput defaultValue={stepIndex} name="stepIndex"/>
                  {`#${stepIndex}`}
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    </Text>
    {children}
  </FBEditor>
);

export default FBEditorLabel;
