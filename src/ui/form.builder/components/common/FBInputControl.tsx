import { Box, Tooltip } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";
import { isEmpty } from "lodash";
import React from "react";
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
  tooltip = "",
  fullWidth = true,
}) => (
  <Tooltip title={tooltip} placement="bottom-start">
    <FormControl {...{ error, fullWidth }}>
      {children}
      {!isEmpty(helperText) && (
        <FormHelperText>
          <Box color={error ? "" : "primary.main"}>{helperText}</Box>
        </FormHelperText>
      )}
      {showContext && (
        <Box mt={3}>
          <FBTextField
            label={contextLabel}
            {...{ disabled }}
            name={`input-context-${name}`}
          />
        </Box>
      )}
    </FormControl>
  </Tooltip>
);

export default FBInput;
