
import { Box, TextField } from "@material-ui/core";
import { OutlinedTextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import Text from "../../../../components/Text";
import { withTextFieldDefaults } from "./utils/hoc";

const FBTextField: React.FunctionComponent<OutlinedTextFieldProps> = ({
  variant,
  label,
  ...props
}) => {

  const labelRenderer = (
    <Box mb={0.5} fontSize="subtitle1.fontSize" fontWeight="fontWeightRegular">
      <Text message={label as string} />
    </Box>
  );

  return (
    <Box mb={4}>
      {label && labelRenderer}
      <TextField
        variant={variant}
        fullWidth={true}
        {...props}
      />
    </Box>
  );
};

export default withTextFieldDefaults(FBTextField);
