import { Box, TextField } from "@material-ui/core";
import React from "react";
import Text from "../../../../components/Text";
import { withTextFieldDefaults } from "./utils/hoc";
import { FBTextFieldProps } from "./utils/types";

const FBTextField: React.FunctionComponent<FBTextFieldProps> = ({
  variant,
  labelRenderer,
  onChange,
  ...props
}) => {

  return (
    <Box mb={4}>
      {labelRenderer}
      <TextField
        variant={variant}
        fullWidth={true}
        onChange={onChange}
        {...props}
        label=""
      />
    </Box>
  );
};

export default withTextFieldDefaults(FBTextField);
