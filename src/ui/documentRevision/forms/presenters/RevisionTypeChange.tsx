/* eslint-disable default-case */
import { Box, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { companySelectors } from "../../../../state/ducks/company";
import { DocumentRevision, RevisionChangeType } from "../../../../state/ducks/documentRevisions/types";
import RadioButton from "../../../components/forms/fields/RadioButton";
import RadioGroup from "../../../components/forms/fields/RadioGroup";
import { required, validator } from "../../../components/forms/fields/validators";
import Text from "../../../components/Text";
import CustomLabelTooltip from "../../../hooks/docCustomization/CustomLabelTooltip";
import { useAdministrativeChange, useNextRevision, useNextRevisionStage, useObsolete, useRevisionSelect } from "../../../hooks/docCustomization/useCustomization";
import { versionNumber } from "../../helpers/generateRevisionNumber";
import { styles } from "./RevisionTypeChange.styles";

interface Props {
  documentTypeId?: string;
  isDisabled: boolean;
  isDocRevFirstDraft: boolean;
  showAdministrativeAndVoidChange: boolean;
  isRecord?: boolean;
  releasedDocRev?: DocumentRevision;
  isAlphaReleased: boolean;
}
const RevisionTypeChange: React.FunctionComponent<Props> = ({
  documentTypeId = "",
  isDisabled,
  isDocRevFirstDraft,
  showAdministrativeAndVoidChange,
  isRecord,
  releasedDocRev,
  isAlphaReleased,
}) => {
  const classes = styles();
  const {
    isVisible: showRevisionSelect,
    label: revisionSelectLabel,
    tooltipConfig: revisionTooltipConfig,
  } = useRevisionSelect(documentTypeId);
  const {
    isVisible: showNextRevisionLevel,
    label: nextRevisionLevelLabel,
    tooltipConfig: revisionLevelTooltipConfig,
  } = useNextRevision(documentTypeId);
  const {
    isVisible: showNextRevisionStage,
    label: nextRevisionStageLabel,
    tooltipConfig: revisionStageTooltipConfig,
  } = useNextRevisionStage(documentTypeId);
  const {
    isVisible: showObsolete,
    label: obsoleteLabel,
    tooltipConfig: obsoleteTooltipConfig,
  } = useObsolete(documentTypeId);
  const {
    isVisible: showAdministrationChange,
    label: administrationChangeLabel,
    tooltipConfig: administrationTooltipConfig,
  } = useAdministrativeChange(documentTypeId);
  const numOfStages = useSelector(companySelectors.getCompanyMaxRevisionStage);

  if (!showRevisionSelect) {
    return null;
  }

  const generateVersionPrediction = ( revisionChangeType: RevisionChangeType ) =>
    versionNumber(revisionChangeType, numOfStages, releasedDocRev, isRecord);

  return (
    <Box mt={3}>
      <CustomLabelTooltip tooltipConfig={revisionTooltipConfig}>
        <Typography variant="h6">
          <Text
            message={isRecord ? "document.revision.type.of.update" : revisionSelectLabel}
          />
        </Typography>
      </CustomLabelTooltip>
      <RadioGroup name="revisionChangeType" validate={validator(required)}>
        <Box>
          {
            showNextRevisionLevel && !showAdministrativeAndVoidChange &&
            <CustomLabelTooltip tooltipConfig={revisionLevelTooltipConfig}>
              <>
                <RadioButton
                  label={<Text message={nextRevisionLevelLabel} />}
                  value={RevisionChangeType.NextRevision}
                  id="RevisionTypeChange-nextRevision"
                  disabled={isDisabled}
                  className={classes.label}
                />
                {generateVersionPrediction(RevisionChangeType.NextRevision)}
              </>
            </CustomLabelTooltip>
          }
        </Box>
        <Box>
          {
            showNextRevisionStage && !showAdministrativeAndVoidChange && !isAlphaReleased &&
            <CustomLabelTooltip tooltipConfig={revisionStageTooltipConfig}>
              <>
                <RadioButton
                  label={
                    <Text message={nextRevisionStageLabel} />
                  }
                  data-cy="upgradeNextRevisionStage"
                  value={RevisionChangeType.NextRevisionStage}
                  id="RevisionTypeChange-nextRevisionStage"
                  disabled={isDisabled}
                  className={classes.label}
                />
                {generateVersionPrediction(RevisionChangeType.NextRevisionStage)}
              </>
            </CustomLabelTooltip>
          }
        </Box>
        <Box>
          {
            showObsolete && !isDocRevFirstDraft &&
            <CustomLabelTooltip tooltipConfig={obsoleteTooltipConfig }>
              <>
                <RadioButton
                  label={<Text message={ showAdministrativeAndVoidChange ? "common.void" : obsoleteLabel} />}
                  value={RevisionChangeType.Obsolete}
                  id="RevisionTypeChange-obsolete"
                  disabled={isDisabled}
                  className={classes.label}
                />
                {generateVersionPrediction(RevisionChangeType.Obsolete)}
              </>
            </CustomLabelTooltip>
          }
        </Box>
        <Box>
          {
            showAdministrationChange && !isDocRevFirstDraft &&
            <CustomLabelTooltip tooltipConfig={administrationTooltipConfig}>
              <>
                <RadioButton
                  label={<Text message={administrationChangeLabel} />}
                  value={RevisionChangeType.AdministrativeChange}
                  id="RevisionTypeChange-administrativeChange"
                  data-cy="RevisionTypeChange-administrativeChange"
                  disabled={isDisabled}
                  className={classes.label}
                />
                {generateVersionPrediction(RevisionChangeType.AdministrativeChange)}
              </>
            </CustomLabelTooltip>
          }
        </Box>
      </RadioGroup>
    </Box>
  );
};
export default React.memo(RevisionTypeChange);
