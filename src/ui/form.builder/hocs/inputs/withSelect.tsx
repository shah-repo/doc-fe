import { Chip } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import _ from "lodash";
import React from "react";
import Text from "../../../components/Text";
import { FBSelectProps } from "../../types/inputs/select.js";
import { withOptions } from "../common/withOptions";

export const withSelect = <T extends FBSelectProps>(
  Component: React.FunctionComponent<T>,
) => withOptions(({
  options,
  optionLabelKey,
  optionValueKey,
  multiple,
  ...props
}: T) => {

  const menuItems = _.map(options, (option, index) => (
    <MenuItem
      key={`${option[optionValueKey || ""]}-${index}`}
      value={option[optionValueKey || ""]}
    >
      <Text message={option[optionLabelKey || ""]} tagName="em" />
    </MenuItem>
  ));

  const renderValue = (selected: string[]) => multiple && (
    <div>
      {(selected).map((value) => (
        <Chip key={value} label={value} />
      ))}
    </div>
  );

  return Component({
    ...(props as T),
    menuItems,
    renderValue,
    multiple,
  });
});
