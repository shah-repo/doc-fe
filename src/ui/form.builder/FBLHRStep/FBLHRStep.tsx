import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBLHRStepProps, FBProvider } from "..";
import { withFBLHRStep } from "./FBLHRStep.wrap";

const FBLHRStep: React.FunctionComponent<FBLHRStepProps> = ({
  name,
  isOutput,
  startMpi,
  lhrStepState,
  loading,
  ...props
}) => (
  <FBProvider {...{ lhrStepState }}>
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
        disabled={!isOutput || loading}
        onClick={startMpi}
        {...{ loading }}
      />
    </Box>
  </FBProvider>
);

export default withFBLHRStep(FBLHRStep);
