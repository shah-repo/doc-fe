import { FormControlLabel, Radio } from "@material-ui/core";
import React from "react";
import { withCheck } from "../../hocs/inputs/withCheck";
import { FBCheckboxProps } from "../../types/inputs/checkbox";
import FBInput from "../common/FBInput";

const FBRadio: React.FunctionComponent<FBCheckboxProps> = ({
  label,
  disabled,
  includeContext,
  name,
  onChange,
  ...props
}) => (
  <FBInput {...props} {...{name}} type="radio">
    <FormControlLabel
      {...{label, disabled, onChange, name}}
      control={<Radio value={name} />}
    />
  </FBInput>
);

export default withCheck(FBRadio);
