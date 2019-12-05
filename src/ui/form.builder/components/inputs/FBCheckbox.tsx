import { FormControlLabel } from "@material-ui/core";
import React from "react";
import { withCheck } from "../../hocs/inputs/withCheck";
import { FBCheckboxProps } from "../../types/inputs/checkbox";
import FBCheckContext from "../common/FBCheckContext";
import FBInput from "../common/FBInput";

const FBCheckbox: React.FunctionComponent<FBCheckboxProps> = ({
  label,
  control,
  disabled,
  includeContext,
  ...props
}) => (
  <FBInput {...props} type="checkbox">
    {control && <FormControlLabel {...{label, control, disabled}}/>}
    <FBCheckContext label="Note" includeContext={includeContext} />
  </FBInput>
);

export default withCheck(FBCheckbox, "checkbox");
