import { Box } from "@material-ui/core";
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
}) => (
  <FormControl error={error} fullWidth>
    {children}
    <FormHelperText>
      <Box color={error ? "" : "primary.main"}>{helperText}</Box>
    </FormHelperText>
    {showContext && (
      <FBTextField
        label={contextLabel}
        {...{ disabled }}
        name={`input-context-${name}`}
      />
    )}
  </FormControl>
);

export default withInput(FBInput);
