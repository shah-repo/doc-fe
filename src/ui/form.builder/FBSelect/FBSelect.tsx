import { Select } from "@material-ui/core";
import React from "react";
import { FBInput, FBSelectProps } from "..";
import { withFBSelect } from "./FBSelect.wrap";

const FBSelect: React.FunctionComponent<FBSelectProps> = ({
  defaultValue,
  menuItems,
  SelectDisplayProps,
  ...props
}) => (
  <FBInput {...props} type="select">
    <Select variant="outlined" {...{ defaultValue, SelectDisplayProps }}>
      {menuItems}
    </Select>
  </FBInput>
);

export default withFBSelect(FBSelect);
