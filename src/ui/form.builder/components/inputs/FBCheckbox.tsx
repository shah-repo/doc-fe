import { Checkbox, FormControlLabel } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { FBInputProps } from "../../types/common";
import FBInput from "../common/FBInput";

const FBCheckbox: React.FunctionComponent<FBInputProps> = ({
  label = "",
  disabled,
  labelValues,
  ...props
}) => (
  <FBInput {...props} type="checkbox" >
    <FormControlLabel
      label={<Text message={label as string} values={labelValues} />}
      control={<Checkbox {...{disabled}} value={props.name} />}
    />
  </FBInput>
);

export default FBCheckbox;
