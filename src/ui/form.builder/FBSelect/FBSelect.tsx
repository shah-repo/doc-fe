import { MenuItem, Select } from "@material-ui/core";
import React from "react";
import { FBInput, FBSelectProps } from "..";
import Text from "../../components/Text";
import { withFBSelect } from "./FBSelect.wrap";

const FBSelect: React.FunctionComponent<FBSelectProps> = ({
  defaultValue,
  menuItems,
  SelectDisplayProps,
  variant = "outlined",
  placeholder,
  style,
  ...props
}) => (
  <FBInput {...props} {...{ placeholder }} type="select">
    <Select displayEmpty {...{ defaultValue, style, variant, SelectDisplayProps }}>
      {placeholder && (
        <MenuItem value={undefined} disabled>
          <Text message={placeholder} />
        </MenuItem>
      )}
      {menuItems}
    </Select>
  </FBInput>
);

export default withFBSelect(FBSelect);
