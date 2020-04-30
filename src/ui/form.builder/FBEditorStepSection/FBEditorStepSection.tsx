import { InputAdornment } from "@material-ui/core";
import React from "react";
import { FBEditor, FBInput, FBTextField } from "..";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Text from "../../components/Text";
import { FBEditorProps } from "../FBEditor/FBEditor.types";

const FBEditorStepSection: React.FunctionComponent<FBEditorProps> = ({
  children,
  includeDefaultValue,
  inputProps: { type, stepIndex } = {},
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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <FBInput defaultValue={stepIndex} name="stepIndex"/>
                {`#${stepIndex}`}
              </InputAdornment>
            ),
          }}
        />
      )}
    </Text>
    {children}
  </FBEditor>
);

export default FBEditorStepSection;
