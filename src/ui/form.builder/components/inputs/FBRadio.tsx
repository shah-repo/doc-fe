import { FormControlLabel } from "@material-ui/core";
import React from "react";
import { withCheck } from "../../hocs/inputs/withCheck";
import { FBCheckboxProps } from "../../types/inputs/checkbox";
import FBCheckContext from "../common/FBCheckContext";
import FBInput from "../common/FBInput";

const FBRadio: React.FunctionComponent<FBCheckboxProps> = ({
  label,
  control,
  disabled,
  includeContext,
  onChange,
  ...props
}) => (
  <FBInput {...props} type="radio">
    {control && <FormControlLabel {...{label, control, disabled}}/>}
    <FBCheckContext label="Note" includeContext={includeContext} />
  </FBInput>
);

export default withCheck(FBRadio, "radio");
