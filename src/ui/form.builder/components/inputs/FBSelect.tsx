import { FormControl, FormHelperText, Select } from "@material-ui/core";
import React from "react";
import { withSelect } from "../../hocs/inputs/withSelect";
import { FBSelectProps } from "../../types/inputs/select";
import FBLabel from "../common/FBLabel";
import FBNoteTextField from "../custom/FBNoteTextField";

const FBSelect: React.FunctionComponent<FBSelectProps> = ({
  variant = "outlined",
  label,
  error,
  helperText,
  showNote = false,
  menuItems,
  disabled,
  name,
  onChange,
  value,
}) => (
  <FBLabel label={label}>
    <FormControl variant={variant} error={error} fullWidth>
      <Select name={name} value={value} onChange={onChange}>{menuItems}</Select>
      <FormHelperText>{helperText}</FormHelperText>
      {showNote && <FBNoteTextField disabled={disabled} name={`select-note-${name}`} />}
    </FormControl>
  </FBLabel>
);

export default withSelect(FBSelect);
