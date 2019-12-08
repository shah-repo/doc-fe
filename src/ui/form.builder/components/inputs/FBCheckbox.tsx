import { FormControlLabel, Checkbox } from "@material-ui/core";
import React from "react";
import { withCheck } from "../../hocs/inputs/withCheck";
import { FBCheckboxProps } from "../../types/inputs/checkbox";
import FBInput from "../common/FBInput";

const FBCheckbox: React.FunctionComponent<FBCheckboxProps> = ({
  label,
  disabled,
  ...props
}) => (
  <FBInput {...props} type="checkbox" >
    <FormControlLabel
      {...{label}}
      control={<Checkbox {...{disabled}} value={props.name} />}
    />
  </FBInput>
);

export default withCheck(FBCheckbox);
