import { Box, FormGroup } from "@material-ui/core";
import React from "react";
import { withOptionRenderer } from "../../hocs/withOptionRenderer";
import { FBFormDefaultProps } from "../../types/common";

const FBCheckboxGroup: React.FunctionComponent<FBFormDefaultProps> = ({
  labelRenderer,
  optionsRenderer,
  includeNote,
  helperText,
}) => (
  <Box mb={4}>
    {labelRenderer}
    <FormGroup row={!includeNote}>
      {optionsRenderer}
    </FormGroup>
    <Box mt={3} pl={1.5} fontSize="caption.fontSize" color="error.main">{helperText}</Box>
  </Box>
);

export default withOptionRenderer(FBCheckboxGroup);
