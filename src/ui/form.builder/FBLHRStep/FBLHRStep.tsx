import { Box } from "@material-ui/core";
import { PlayCircleFilled } from "@material-ui/icons";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBLHRStepProps, FBProvider, FBText } from "..";
import { withFBLHRStep } from "./FBLHRStep.wrap";

const FBLHRStep: React.FunctionComponent<FBLHRStepProps> = ({
  name,
  isOutput,
  startMpi,
  openLHRs,
  lhrStepState,
  loading,
  stepLHRs,
  setDisplayToLHRs,
  setDisplayToMPI,
  isHovering,
  ...props
}) => (
  <FBProvider {...{ lhrStepState }}>
    {stepLHRs && (
      <Box display="flex" alignItems="center" mb={1}>
        <Box mr={1} display="flex" alignItems="center">
          <PlayCircleFilled />
        </Box>
        <FBText locale="form.builder.step.started" />
      </Box>
    )}
    <Box
      display="flex"
      alignItems="flex-start"
    >
      <Box
        onMouseEnter={setDisplayToMPI}
        onMouseLeave={setDisplayToLHRs}
        flexGrow={1}
        onClick={() => {
          if (isOutput && stepLHRs) {
            openLHRs();
          }
        }}
      >
        <FBAutocompleteAsync
          boxProps={{ flexGrow: 1 }}
          type="lhrstep"
          optionId={FBAutocompleteAsyncOption.mpiDocuments}
          autosave
          withState
          disabled={isOutput}
          {...{ name }}
          getOptionLabel={(option) => stepLHRs && !isHovering
            ? option.name
            : `${option.document?.docId } - ${option.name}`}
        />
      </Box>
      <FBButton
        label="form.builder.start.mpi"
        disabled={!isOutput || loading || Boolean(stepLHRs)}
        onClick={startMpi}
        {...{ loading }}
      />
    </Box>
  </FBProvider>
);

export default withFBLHRStep(FBLHRStep);
