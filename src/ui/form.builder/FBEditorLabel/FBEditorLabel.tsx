import { InputAdornment } from "@material-ui/core";
import React from "react";
import { FBConditionalWrapper, FBEditor, FBEditorProps, FBTextField } from "..";
import Text from "../../components/Text";

const FBEditorLabel: React.FunctionComponent<FBEditorProps> = ({
  children,
  includeDefaultValue,
  standalone = false,
  inputProps: { type, stepIndex } = {},
  inputProps,
  ...props
}) => (
  <FBConditionalWrapper
    condition={!standalone}
    wrapper={(wrapperChildren) => (
      <FBEditor {...props} {...{ inputProps }}>
        {wrapperChildren}
        {children}
      </FBEditor>
    )}
  >
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
                  <FBTextField defaultValue={stepIndex} name="stepIndex" hidden />
                  {`#${stepIndex}`}
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    </Text>
  </FBConditionalWrapper>
);

export default FBEditorLabel;
