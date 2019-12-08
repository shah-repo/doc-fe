import Box from "@material-ui/core/Box";
import React from "react";
import { FBInputProps } from "../../types/common";
import FBLabel from "./FBLabel";
import FBInputControl from "./FBInputControl";

const FBInput: React.FunctionComponent<FBInputProps> = ({
  label,
  error,
  labelValues,
  ...props
}) => {
  return (
    <Box mb={4}>
      {label && <FBLabel {...{error, label, labelValues}} />}
      <FBInputControl {...props} />
    </Box>
  );
};

export default FBInput;
