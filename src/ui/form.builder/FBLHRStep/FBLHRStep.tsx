import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBLHRStepProps } from "..";
import { withFBLHRStep } from "./FBLHRStep.wrap";

const FBLHRStep: React.FunctionComponent<FBLHRStepProps> = ({
  name,
  isOutput,
  startMpi,
  ...props
}) => (
  <Box display="flex" alignItems="flex-start">
    <FBAutocompleteAsync
      boxProps={{ flexGrow: 1 }}
      type="lhrstep"
      optionId={FBAutocompleteAsyncOption.mpiDocuments}
      autosave
      withState
      disabled={isOutput}
      {...{ name }}
    />
    <FBButton
      label="form.builder.start.mpi"
      disabled={!isOutput}
      onClick={startMpi}
    />
  </Box>
);

export default withFBLHRStep(FBLHRStep);
