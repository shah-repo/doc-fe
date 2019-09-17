import { Box, TextField } from "@material-ui/core";
import React from "react";
import Text from "../../../../components/Text";
import { withTextFieldDefaults } from "./utils/hoc";
import { FBTextFieldProps } from "./utils/types";

const FBTextField: React.FunctionComponent<FBTextFieldProps> = ({
  variant,
  label,
  onChange,
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
        onChange={onChange}
        {...props}
      />
    </Box>
  );
};

export default withTextFieldDefaults(FBTextField);
