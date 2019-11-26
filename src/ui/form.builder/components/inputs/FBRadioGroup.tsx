import { Box, FormGroup } from "@material-ui/core";
import { observer } from "mobx-react";
import React from "react";
import { withOptionRenderer } from "../../hocs/withOptionRenderer";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBFormDefaultProps } from "../../types/common";

const FBRadioGroup: React.FunctionComponent<FBFormDefaultProps> = ({
  labelRenderer,
  optionsRenderer,
  includeNote,
  row,
  name,
}) => (
  <Box mb={4}>
    {labelRenderer}
    <FormGroup row={(row !== undefined) ? row : !includeNote}>
      {optionsRenderer}
    </FormGroup>
    <Box mt={3} pl={1.5} fontSize="caption.fontSize" color="error.main">
      {FBValidatorStore.errors[name || ""] || ""}
    </Box>
  </Box>
);

export default withOptionRenderer(observer(FBRadioGroup));
