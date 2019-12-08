import { FormControlLabel, Radio } from "@material-ui/core";
import React from "react";
import { withCheck } from "../../hocs/inputs/withCheck";
import { FBCheckboxProps } from "../../types/inputs/checkbox";
import FBInput from "../common/FBInput";

const FBRadio: React.FunctionComponent<FBCheckboxProps> = ({
  label,
  disabled,
  ...props
}) => (
  <FBInput {...props} type="radio">
    <FormControlLabel
      {...{label}}
      control={<Radio {...{disabled}} value={props.name} />}
    />
  </FBInput>
);

export default withCheck(FBRadio);
