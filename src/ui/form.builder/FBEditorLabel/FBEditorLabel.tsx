import { InputAdornment } from "@material-ui/core";
import React from "react";
import { FBConditionalWrapper, FBEditor, FBEditorProps, FBTextField } from "..";
import Text from "../../components/Text";
import { styles as AutoCompleteStyles } from "../styles/FBAutocomplete.styles";
import { styles } from "../styles/FBEditorTextField.styles";

const FBEditorLabel: React.FunctionComponent<FBEditorProps> = ({
  children,
  includeDefaultValue,
  standalone = false,
  inputProps: { type, stepIndex } = {},
  inputProps,
  ...props
}) => {
  const classes = styles();
  return (
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
            className={classes.textfield}
            boxProps={{ mb: 3.125, className: classes.error }}
            labelProps={AutoCompleteStyles.labelProps}
          />
        )}
      </Text>
    </FBConditionalWrapper>
  );
};

export default FBEditorLabel;
