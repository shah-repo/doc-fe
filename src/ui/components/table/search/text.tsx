import { OutlinedInputProps } from "@material-ui/core/OutlinedInput";
import React from "react";
import { StyledSearchTextField } from "./styles";
import { TableSearchFieldProps } from "./types";

type Props = Partial<TableSearchFieldProps>;

export const TableSearchTextField: React.FunctionComponent<Props> = ({
  dataKey,
}) => {

  return (
    <StyledSearchTextField
      name={dataKey}
      // onChange={handleChange("name")}
      margin="normal"
      InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
    />
  );
};
