import { Select } from "@material-ui/core";
import React from "react";
import { FBInput, FBSelectProps } from "..";
import { withFBSelect } from "./FBSelect.wrap";

const FBSelect: React.FunctionComponent<FBSelectProps> = ({
  defaultValue,
  menuItems,
  variant = "outlined",
  style,
  ...props
}) => (
  <FBInput {...props} type="select">
    <Select {...{ defaultValue, style, variant }}>
      {menuItems}
    </Select>
  </FBInput>
);

export default withFBSelect(FBSelect);
