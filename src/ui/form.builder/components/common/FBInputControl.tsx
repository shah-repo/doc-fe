import FormControl from "@material-ui/core/FormControl/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";
import React from "react";
import { withInput } from "../../hocs/common/withInput";
import { FBInputProps } from "../../types/common";
import FBTextField from "../inputs/FBTextField";

const FBInput: React.FunctionComponent<FBInputProps> = ({
  error,
  helperText = "",
  children,
  showContext,
  contextLabel,
  disabled,
  name,
}) => {
  return (
    <FormControl error={error} fullWidth>
      {children}
      <FormHelperText>{helperText}</FormHelperText>
      {showContext && <FBTextField label={contextLabel} {...{disabled}} name={`context-${name}`} />}
    </FormControl>
  );
};

export default withInput(FBInput);
