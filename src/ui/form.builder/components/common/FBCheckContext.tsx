import Box from "@material-ui/core/Box/Box";
import React from "react";
import { withCheckContext } from "../../hocs/common/withCheckContext";
import { FBCheckContextProps } from "../../types/common/checkcontext";
import FBTextField from "../inputs/FBTextField";

const FBCheckContext: React.FunctionComponent<FBCheckContextProps> = ({
  showContext,
  disabled,
  name,
  label = "",
}) => (
  <Box>
    {showContext && (
      <FBTextField
        label={label}
        disabled={disabled}
        name={`check-context-${name}`}
      />
    )}
  </Box>
);

export default withCheckContext(FBCheckContext);
