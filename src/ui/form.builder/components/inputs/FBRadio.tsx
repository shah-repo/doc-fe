import { FormControlLabel, Radio } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { FBInputProps } from "../../types/common";
import FBInput from "../common/FBInput";

const FBRadio: React.FunctionComponent<FBInputProps> = ({
  label = "",
  disabled,
  labelValues,
  ...props
}) => (
  <FBInput {...props} type="radio">
    <FormControlLabel
      label={<Text message={label as string} values={labelValues} />}
      control={<Radio {...{disabled}} value={props.name} />}
    />
  </FBInput>
);

export default FBRadio;
