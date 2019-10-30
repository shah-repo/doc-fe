import { Box, FormControl, Select } from "@material-ui/core";
import React from "react";
import { withSelectDefaults } from "../../hocs/withSelectDefaults";
import { FBSelectProps } from "../../types/select";
import FBNoteTextField from "../custom/FBNoteTextField";

const FBSelect: React.FunctionComponent<FBSelectProps> = ({
  variant,
  labelRenderer,
  items,
  field,
  includeNote,
  showNote = false,
  ...props
}) => (
  <Box mb={4}>
    {labelRenderer}
    <FormControl variant={variant} fullWidth={true} required={props.required}>
      <Select {...props}>{items}</Select>
    </FormControl>
    {showNote && (
      <Box pt={2}>
        <FBNoteTextField name={props.name} />
      </Box>
    )}
  </Box>
);

export default withSelectDefaults(FBSelect);
