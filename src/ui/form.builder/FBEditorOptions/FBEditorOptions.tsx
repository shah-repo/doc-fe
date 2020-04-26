import { TextField } from "@material-ui/core";
import React, { ChangeEvent } from "react";
import { FBInput, FBInputProps } from "..";
import Text from "../../components/Text";

const FBEditorOptions: React.FunctionComponent<FBInputProps> = ({
  onChange,
  ...props
}) => (
  <Text message="form.builder.options.placeholder">
    {(placeholder: string) => (
      <Text message="form.builder.options.note">
        {(helperText) => (
          <FBInput {...props} name="options" type="editoroptions">
            <TextField
              variant="outlined"
              rows={5}
              multiline
              onChange={onChange as unknown as (event: ChangeEvent<HTMLInputElement>) => void}
              {...{placeholder, helperText}}
            />
          </FBInput>
        )}
      </Text>
    )}
  </Text>
);

export default FBEditorOptions;
