import { Box } from "@material-ui/core";
import { CheckCircle, PlayCircleFilled } from "@material-ui/icons";
import { isEmpty } from "lodash";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBInput, FBLHRStepProps, FBProvider, FBSection, FBText } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { isDocumentRevisionReleased } from "../../documentRevision/helpers/documentRevisionStatus";
import Colors from "../../layout/theme/utils/colors";
import FBLHRStepProcedureItem from "../FBLHRStepProcedureItem/FBLHRStepProcedureItem";
import { FBProcedureItemType } from "../FBProcedureItem/FBProcedureItem.types";
import { withFBLHRStep } from "./FBLHRStep.wrap";

const FBLHRStep: React.FunctionComponent<FBLHRStepProps> = ({
  filterOptions,
  startMpi,
  openLHRs,
  setDisplayToLHRs,
  name,
  isOutput,
  lhrStepState,
  loading,
  stepLHRs,
  isDraft,
  isPendingChange,
  disabled,
  ownerOfStartMPIAction,
  ownerOfCompleteMPIAction,
  materials,
  equipment,
  index,
  isDocumentLHRT,
  stepIndex,
  label,
  gutter,
  autosave,
  lhrBuildTypeExist,
  ...props
}) => (
  <FBProvider {...{ lhrStepState }}>
    <FBInput {...{ name, gutter, autosave }} type="lhrstep">
      <FBSection {...{ stepIndex, label }} />
      <Box
        display="flex"
        alignItems="flex-start"
      >
        <Box
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
            gutter={false}
            autosave
            rules="required"
            withState
            shouldReloadOnInit
            disabled={isOutput || !(isDraft || isPendingChange)}
            withoutPrefixRoot={Boolean(stepLHRs)}
            {...{ name, loading, filterOptions }}
            inputStyle={stepLHRs?.redline ? {
              background: Colors.light_red,
              border: `1px solid ${Colors.error_red}`,
              paddingLeft: "5px",
            } : {}}
          />
        </Box>
        <FBButton
          disabled={!isOutput || loading || !lhrBuildTypeExist || disabled}
          label={ stepLHRs ? "form.builder.view.step" : "form.builder.start.step" }
          onClick={stepLHRs ? () => openLHRs(stepLHRs) : startMpi }
          {...{ loading }}
        />
      </Box>
      {isDocumentLHRT && !isEmpty(materials) && <FBLHRStepProcedureItem
        value={materials}
        type={FBProcedureItemType.materials}
        lhrStepIndex={index}
        isPendingChange
      />}
      {isDocumentLHRT && !isEmpty(equipment) && <FBLHRStepProcedureItem
        value={equipment}
        type={FBProcedureItemType.equipment}
        lhrStepIndex={index}
        isPendingChange
      />}
      {stepLHRs && (
        <Box display="flex" alignItems="center" mt={1} mb={4}>
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
              date: isDocumentRevisionReleased(stepLHRs.status)
                ? getFormattedDateString(stepLHRs?.releasedAt, MomentFormats.DateTime)
                : getFormattedDateString(stepLHRs?.createdAt, MomentFormats.DateTime),
              // owner will be included in next release by new requirements
              // owner: isDocumentRevisionReleased(stepLHRs.status)
              //   ? ownerOfCompleteMPIAction
              //   : ownerOfStartMPIAction,
            }}
          />
        </Box>
      )}
    </FBInput>
  </FBProvider>
);

export default withFBLHRStep(FBLHRStep);
