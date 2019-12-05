import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";
import React from "react";
import { withInput } from "../../hocs/common/withInput";
import { FBInputProps } from "../../types/common";
import FBLabel from "./FBLabel";

const FBInput: React.FunctionComponent<FBInputProps> = ({
  label,
  error,
  helperText = "",
  labelValues,
  children,
}) => {
  return (
    <Box mb={4}>
      {label && <FBLabel {...{error, label, labelValues}} />}
      <FormControl error={error} fullWidth>
        {children}
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </Box>
  );
};

export default withInput(FBInput);
