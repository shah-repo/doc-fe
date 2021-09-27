import { OutlinedInputProps } from "@material-ui/core/OutlinedInput";
import React from "react";
import { searchQueryString } from "./helpers";
import { StyledSearchTextField } from "./styles";
import { TableSearchFieldProps } from "./types";

type Props = Partial<TableSearchFieldProps>;

export const TableSearchTextField: React.FunctionComponent<Props> = ({
  dataKey = "",
  searchValueGetter,
  queryGetter,
  defaultValue,
}) => {
  const [value, setValue] = React.useState<string | number>(defaultValue || "");

  React.useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    if (!queryGetter) { return; }
    const query = event.target.value;
    setValue(query);

    const finalQuery = searchQueryString({ query, searchValueGetter });
    queryGetter(dataKey, finalQuery);
  };

  return (
    <StyledSearchTextField
      id={dataKey}
      value={value}
      name={dataKey}
      onChange={handleChange}
      margin="normal"
      InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
      inputProps={{ "data-lpignore": true }}
    />
  );
};

TableSearchTextField.displayName = "TableSearchTextField";
