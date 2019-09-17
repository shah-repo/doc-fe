import { Box, FormControl, Select } from "@material-ui/core";
import React from "react";
import { withSelectDefaults } from "./utils/hoc";
import { FBSelectProps } from "./utils/types";

const FBSelect: React.FunctionComponent<FBSelectProps> = ({
  variant,
  labelRenderer,
  emptyItem,
  items,
  ...props
}) => {

  return (
    <Box mb={4}>
      {labelRenderer}
      <FormControl variant={variant} fullWidth={true}>
        <Select {...props} >
          {emptyItem}
          {items}
        </Select>
      </FormControl>
    </Box>
  );
};

export default withSelectDefaults(FBSelect);
