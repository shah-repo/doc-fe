import { Box, FormControlLabel } from "@material-ui/core";
import React from "react";
import Text from "../../../../components/Text";
import { withCheckboxDefaults } from "./utils/hoc";
import { FBCheckboxProps } from "./utils/types";

const FBCheckbox: React.FunctionComponent<FBCheckboxProps> = ({
  labelRenderer,
  controlLabel,
  ...props
}) => {

  return (
    <Box mb={4}>
      {labelRenderer}
      <FormControlLabel
        {...props}
        label={controlLabel && <Text message={controlLabel} />}
      />
    </Box>
  );
};

export default withCheckboxDefaults(FBCheckbox);
