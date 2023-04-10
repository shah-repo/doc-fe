import React, { FC, ChangeEvent } from "react";
import { Select, MenuItem } from "@material-ui/core";
import Filter from "../Filter";
import { DropdownFilterCellProps } from "./types";

export const DropdownFilter: FC<DropdownFilterCellProps> = (props) => {
  const {
    data,
    value = "",
    operator = "eq",
    defaultItem,
    onChange,
  } = props;

  const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
    const newValue = event.currentTarget.value;

    if (newValue === value) {
      return;
    }

    onChange({
      value: newValue,
      operator,
      syntheticEvent: event,
    });
  };

  return (
    <Filter>
      <Select
        value={value}
        onChange={handleChange}
      >
        {defaultItem && (
          <MenuItem value={defaultItem.value}>
            {defaultItem.text}
          </MenuItem>
        )}
        {data.map(({ value, text }) => (
          <MenuItem
            key={String(value)}
            value={String(value)}
          >
            {text}
          </MenuItem>
        ))}
      </Select>
    </Filter>
  );
};

export default DropdownFilter;
