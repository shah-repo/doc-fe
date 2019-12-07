import { Select } from "@material-ui/core";
import React from "react";
import { withSelect } from "../../hocs/inputs/withSelect";
import { FBSelectProps } from "../../types/inputs/select";
import FBInput from "../common/FBInput";

const FBSelect: React.FunctionComponent<FBSelectProps> = ({
  menuItems,
  ...props
}) => (
  <FBInput {...props} type="select">
    <Select variant="outlined" {...props}>
      {menuItems}
    </Select>
  </FBInput>
);

export default withSelect(FBSelect);
