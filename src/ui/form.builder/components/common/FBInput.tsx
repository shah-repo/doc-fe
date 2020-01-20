import Box from "@material-ui/core/Box";
import React from "react";
import { withInput } from "../../hocs/common/withInput";
import { FBInputProps } from "../../types/common";
import FBInputControl from "./FBInputControl";
import FBLabel from "./FBLabel";

const FBInput: React.FunctionComponent<FBInputProps> = ({
  label,
  error,
  labelValues,
  gutter = true,
  hidden,
  ...props
}) => (
  <Box>
    {!hidden && (
      <Box mb={gutter ? 4 : 0}>
        {label && <FBLabel {...{ error, label, labelValues }} />}
        <FBInputControl {...props} {...{label}} />
      </Box>
    )}
  </Box>

);

export default withInput(FBInput);
