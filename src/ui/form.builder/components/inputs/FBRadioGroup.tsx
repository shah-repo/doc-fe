import { Box, FormGroup } from "@material-ui/core";
import React from "react";
import { withOptionRenderer } from "../../hocs/withOptionRenderer";
import { FBFormDefaultProps } from "../../types/common";

const FBRadioGroup: React.FunctionComponent<FBFormDefaultProps> = ({
  labelRenderer,
  optionsRenderer,
  includeNote,
}) => (
  <Box mb={4}>
    {labelRenderer}
    <FormGroup row={!includeNote}>{optionsRenderer}</FormGroup>
  </Box>
);

export default withOptionRenderer(FBRadioGroup);
