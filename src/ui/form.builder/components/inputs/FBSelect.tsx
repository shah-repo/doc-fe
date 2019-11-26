import { Box, FormControl, Select } from "@material-ui/core";
import React from "react";
import { withSelectDefaults } from "../../hocs/withSelectDefaults";
import { FBSelectProps } from "../../types/select";
import FBNoteTextField from "../custom/FBNoteTextField";

const FBSelect: React.FunctionComponent<FBSelectProps> = ({
  variant = "outlined",
  labelRenderer,
  items,
  field,
  includeNote,
  showNote = false,
  helperText,
  ...props
}) => (
    <Box mb={4}>
      {labelRenderer}
      <FormControl variant={variant} fullWidth={true}>
        <Select {...props}>{items}</Select>
      </FormControl>
      {showNote && (
        <Box pt={2}>
          <FBNoteTextField disabled={props.disabled} name={props.name} />
        </Box>
      )}
      <Box mt={3} pl={1.5} fontSize="caption.fontSize" color="error.main">{helperText}</Box>
    </Box>
  );

export default withSelectDefaults(FBSelect);
