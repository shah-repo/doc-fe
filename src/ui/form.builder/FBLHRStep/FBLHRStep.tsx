import { Box } from "@material-ui/core";
import { CheckCircle, PlayCircleFilled } from "@material-ui/icons";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBLHRStepProps, FBProvider, FBText, FBTextField } from "..";
import { isDocumentRevisionReleased } from "../../documentRevision/helpers/documentRevisionStatus";
import Colors from "../../layout/theme/utils/colors";
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
  isDraft,
  disabled,
  ...props
}) => (
  <FBProvider {...{ lhrStepState }}>
    {stepLHRs && (
      <Box display="flex" alignItems="center" mb={1}>
        <Box mr={1} display="flex" alignItems="center">
          {
            isDocumentRevisionReleased(stepLHRs.status)
              ? <CheckCircle />
              : <PlayCircleFilled />
          }
        </Box>
        <FBText
          locale={
            isDocumentRevisionReleased(stepLHRs.status)
              ? "form.builder.step.completed"
              : "form.builder.step.started"
          }
        />
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
          withoutPrefixRoot={(stepLHRs && !isHovering) as boolean}
          disabled={isOutput || !isDraft}
          {...{ name, loading }}
          inputStyle={stepLHRs?.redline ? {
            background: Colors.light_red,
            border: `1px solid ${Colors.error_red}`,
            paddingLeft: "5px",
          } : {}}
        />
      </Box>
      <FBButton
        label="form.builder.start.mpi"
        disabled={!isOutput || loading || Boolean(stepLHRs) || disabled}
        onClick={startMpi}
        {...{ loading }}
      />
    </Box>
    {isOutput && (
      <>
        <FBTextField
          {...{ disabled }}
          name={`fb-lhrs-start-quantity-${name}`}
          type="number"
          label="form.builder.start.quantity"
        />
        <FBTextField
          {...{ disabled }}
          name={`fb-lhrs-accepted-quantity-${name}`}
          type="number"
          label="form.builder.accepted.quantity"
        />
        <FBTextField
          {...{ disabled }}
          name={`fb-lhrs-rejected-quantity-${name}`}
          type="number"
          label="form.builder.rejected.quantity"
        />
      </>
    )}

  </FBProvider>
);

export default withFBLHRStep(FBLHRStep);
