import { Box } from "@material-ui/core";
import React from "react";
import InputField from "../Input";
import SelectField from "../Select";
import { styles } from "./utils/styles";
import { EditableSelectFieldProps } from "./utils/types";

type Props = EditableSelectFieldProps;

const EditableSelectPresenter: React.FunctionComponent<Props> = ({
  name = "",
  includeEmpty = true,
  label = "",
  options = [],
  handleChange,
  value = "",
  gutter = true,
}) => {
  const classes = styles({ gutter, error: false });

  return (
    <Box className={classes.root}>
      <SelectField
        name=""
        label={undefined}
        selectProps={{ inputProps: { id: "type" }, onChange: handleChange }}
        options={options}
        includeEmpty={includeEmpty}
        formControlProps={{ className: classes.selectField }}
      />
      <InputField
        name={name}
        label={label}
        inputProps={{ value, onChange: handleChange }}
        formControlProps={{ className: classes.textField }}
      />
    </Box>
  );
};

export default EditableSelectPresenter;
