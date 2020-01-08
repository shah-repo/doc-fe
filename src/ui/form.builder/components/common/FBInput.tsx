import Box from "@material-ui/core/Box";
import React from "react";
import { FBInputProps } from "../../types/common";
import FBInputControl from "./FBInputControl";
import FBLabel from "./FBLabel";

const FBInput: React.FunctionComponent<FBInputProps> = ({
  label,
  error,
  labelValues,
  gutter = true,
  ...props
}) => (
  <Box mb={gutter ? 4 : -3}>
    {label && <FBLabel {...{ error, label, labelValues }} />}
    <FBInputControl {...props} {...{label}} />
  </Box>
);

export default FBInput;
