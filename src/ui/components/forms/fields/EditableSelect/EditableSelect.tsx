import { Box, MenuItem, TextField } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import { Translation } from "../../../../translations/types";
import Text from "../../../Text";
import { SelectOption } from "../Select";
import styles from "./styles";

export type Props = WithStyles <typeof styles> & {
  name: string;
  label: Translation;
  options: SelectOption[];
  includeEmpty: boolean;
  defaultValue?: string;
  onChange?: (name: string, value: string | number) => any;
};

export const EditableSelect: React.FunctionComponent<Props> = ({
  classes,
  name,
  label,
  options,
  includeEmpty,
  defaultValue,
  onChange,
}) => {

  const [value, setValue] = React.useState<string | number>(defaultValue || "");

  const EmptyItem = includeEmpty && (
    <MenuItem value="">
      <Text translation="fields.select.none" tagName="em" />
    </MenuItem>
  );

  const Items = options.map((option) => (
    <MenuItem key={option.value} value={option.value}>{option.text}</MenuItem>
  ));

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const v = event.target.value as string | number;
    setValue(v);
    if (!onChange) { return; }
    onChange(name, v);
  };

  return (
    <Box className={classes.root}>
      <TextField
        select={true}
        className={classes.selectField}
        margin="normal"
        variant="filled"
        onChange={handleChange}
      >
        {includeEmpty && EmptyItem}
        {Items}
      </TextField>
      <TextField
        name={name}
        label={<Text message={label} />}
        className={classes.textField}
        variant="filled"
        margin="normal"
        value={value}
        onChange={handleChange}
        InputProps={{ className: classes.input }}
      />
    </Box>
  );
};

export default withStyles(styles)(EditableSelect);
