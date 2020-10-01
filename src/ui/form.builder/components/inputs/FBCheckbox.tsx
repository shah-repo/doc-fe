import { Checkbox, FormControlLabel } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { FBInputProps } from "../../types/common";
import FBInput from "../common/FBInput";

const FBCheckbox: React.FunctionComponent<FBInputProps> = ({
  label = "",
  defaultValue,
  ...props
}) => (
  <FBInput {...props} type="checkbox" >
    <FormControlLabel
      label={<Text message={label as string} />}
      control={(
        <Checkbox
          disabled={props.disabled}
          value={props.name}
          checked={defaultValue as boolean || props.value as boolean}
        />
      )}
    />
  </FBInput>);

export default FBCheckbox;
