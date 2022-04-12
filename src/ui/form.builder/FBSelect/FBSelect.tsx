import { createStyles, makeStyles, MenuItem, Select } from "@material-ui/core";
import React from "react";
import { FBInput, FBSelectProps } from "..";
import Text from "../../components/Text";
import { withFBSelect } from "./FBSelect.wrap";

const styles = makeStyles(() =>
  createStyles({
    select: {
      "& .MuiSelect-root": {
        padding: 10.4,
      },
    },
  }));

const FBSelect: React.FunctionComponent<FBSelectProps> = ({
  defaultValue,
  menuItems,
  SelectDisplayProps,
  variant = "outlined",
  placeholder,
  style,
  ...props
}) => {
  const classes = styles();
  return (
    <FBInput {...props} {...{ placeholder }} type="select">
      <Select displayEmpty {...{ defaultValue, style, variant, SelectDisplayProps }} className={classes.select}>
        {!!placeholder?.trim() && (
          <MenuItem value={undefined} disabled>
            <Text message={placeholder} />
          </MenuItem>
        )}
        {menuItems}
      </Select>
    </FBInput>
  );
};

export default withFBSelect(FBSelect);
