import { Box, MenuItem, TextField, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import Text from "../../../Text";
import styles from "./utils/styles";
import { EditableSelectFieldProps } from "./utils/types";

type Props = EditableSelectFieldProps & WithStyles <typeof styles>;

export const EditableSelectPresenter: React.FunctionComponent<Props> = ({
  classes,
  name,
  includeEmpty = true,
  label = "",
  options = [],
  handleChange,
  value = "",
}) => {

  const EmptyItem = includeEmpty && (
    <MenuItem value="">
      <Text translation="fields.select.none" tagName="em" />
    </MenuItem>
  );

  const Items = options.map((option) => (
    <MenuItem key={option.value} value={option.value}>{option.text}</MenuItem>
  ));

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

export default withStyles(styles)(EditableSelectPresenter);
