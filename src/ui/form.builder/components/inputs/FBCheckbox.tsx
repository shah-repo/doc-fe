import { FormControlLabel, Checkbox, Box } from "@material-ui/core";
import React from "react";
import { withCheck } from "../../hocs/inputs/withCheck";
import { FBCheckboxProps } from "../../types/inputs/checkbox";
import FBInput from "../common/FBInput";

const FBCheckbox: React.FunctionComponent<FBCheckboxProps> = ({
  label,
  disabled,
  name,
  onChange,
  value,
  ...props
}) => (
  <Box>
    <FBInput {...props} {...{name, value}} type="checkbox" >
      <FormControlLabel
        {...{label, disabled, onChange, name, value}}
        control={<Checkbox value={name} />}
      />
    </FBInput>
  </Box>
);

export default withCheck(FBCheckbox);
