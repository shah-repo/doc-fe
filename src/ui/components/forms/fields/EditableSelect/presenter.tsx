import { Box, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import InputField from "../Input";
import SelectField from "../Select";
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

  return (
    <Box className={classes.root}>
      <SelectField
        name=""
        label={undefined}
        selectProps={{inputProps: { id: "type" }, onChange: handleChange }}
        options={options}
        includeEmpty={includeEmpty}
        formControlProps={{ className:  classes.selectField }}
      />
      <InputField
        name={name}
        label={label}
        inputProps={{ value, onChange: handleChange}}
        formControlProps={{ className:  classes.textField }}
      />
    </Box>
  );
};

export default withStyles(styles)(EditableSelectPresenter);
