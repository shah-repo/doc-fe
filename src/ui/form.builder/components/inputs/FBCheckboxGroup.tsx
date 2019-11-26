import { Box, FormGroup } from "@material-ui/core";
import React from "react";
import { withOptionRenderer } from "../../hocs/withOptionRenderer";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBFormDefaultProps } from "../../types/common";

const FBCheckboxGroup: React.FunctionComponent<FBFormDefaultProps> = ({
  labelRenderer,
  optionsRenderer,
  includeNote,
  name,
}) => (
  <Box mb={4}>
    {labelRenderer}
    <FormGroup row={!includeNote}>{optionsRenderer}</FormGroup>
    <Box mt={3} pl={1.5} fontSize="caption.fontSize" color="error.main">
      {FBValidatorStore.errors[name || ""] || ""}
    </Box>
  </Box>
);

export default withOptionRenderer(FBCheckboxGroup);
