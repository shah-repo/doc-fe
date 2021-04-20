import { Box } from "@material-ui/core";
import { CheckCircle, PlayCircleFilled } from "@material-ui/icons";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBLHRStepProps, FBProvider, FBText, FBTextField } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { isDocumentRevisionReleased } from "../../documentRevision/helpers/documentRevisionStatus";
import Colors from "../../layout/theme/utils/colors";
import FBLHRStepProcedureItem from "../FBLHRStepProcedureItem/FBLHRStepProcedureItem";
import { FBProcedureItemType } from "../FBProcedureItem/FBProcedureItem.types";
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
  materials,
  equipment,
  index,
  isDocumentLHRT,
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
          values={{
            date: getFormattedDateString(stepLHRs?.releasedAt, MomentFormats.DateTime),
          }}
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
          boxProps={{ flexGrow: 1, mb: 2.5 }}
          type="lhrstep"
          optionId={FBAutocompleteAsyncOption.mpiDocuments}
          autosave
          withState
          shouldReloadOnInit
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
    {isDocumentLHRT && <FBLHRStepProcedureItem
      value={materials}
      type={FBProcedureItemType.materials}
      lhrStepIndex={index}
    />}
    {isDocumentLHRT && <FBLHRStepProcedureItem
      value={equipment}
      type={FBProcedureItemType.equipment}
      lhrStepIndex={index}
    />}
    <Box
      display="flex"
      mb={4}
    >
      <b>{stepLHRs?.owner?.user.name}</b>
      {stepLHRs?.createdAt && (
        <Box color={Colors.gray}>
              &nbsp;| {getFormattedDateString(stepLHRs?.createdAt, MomentFormats.DateTime)}
        </Box>
      )}
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
