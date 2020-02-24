import { FormControl, InputBase, MenuItem, Select } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import React from "react";
import { SelectOption } from "../../forms/fields/Select";
import { searchQueryString } from "./helpers";
import { selectStyles } from "./styles";
import { TableSearchFieldProps } from "./types";

type Props = Partial<TableSearchFieldProps>;

export const TableSearchSelectField: React.FunctionComponent<Props> = ({
  dataKey = "",
  selectOptions = [],
  searchValueGetter,
  queryGetter,
  defaultValue,
}) => {

  const classes = selectStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (!queryGetter) { return; }

    const finalQuery = searchQueryString({ query: event.target.value as string, searchValueGetter });
    queryGetter(dataKey, finalQuery);
  };

  const menuItemRenderer = (option: SelectOption) => (
    <MenuItem key={option.value} value={option.value}>{option.text}</MenuItem>
  );

  return (
    <FormControl variant="filled" className={classes.root}>
      <InputLabel htmlFor="search-select-field" />
      <Select
        value={defaultValue || ""}
        onChange={handleChange}
        input={<InputBase name={dataKey} id={dataKey} className={classes.input} />}
      >
        <MenuItem value=""><em>None</em></MenuItem>
        {selectOptions.map((o) => menuItemRenderer(o))}
      </Select>
    </FormControl>
  );
};
