/* eslint-disable default-case */
import { Box, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { companySelectors } from "../../../../state/ducks/company";
import { DocumentRevision, RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import RadioButton from "../../../components/forms/fields/RadioButton";
import RadioGroup from "../../../components/forms/fields/RadioGroup";
import { required, validator } from "../../../components/forms/fields/validators";
import Text from "../../../components/Text";
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
export const RevisionTypeChange: React.FunctionComponent<Props> = ({
  documentTypeId = "",
  isDisabled,
  isDocRevFirstDraft,
  showAdministrativeAndVoidChange,
  isRecord,
  releasedDocRev,
  isAlphaReleased,
}) => {
  const classes = styles();
  const [showRevisionSelect, revisionSelectLabel] = useRevisionSelect(documentTypeId);
  const [showNextRevisionLevel, nextRevisionLevelLabel] = useNextRevision(documentTypeId);
  const [showNextRevisionStage, nextRevisionStageLabel] = useNextRevisionStage(documentTypeId);
  const [showObsolete, obsoleteLabel] = useObsolete(documentTypeId);
  const [showAdministrationChange, administrationChangeLabel] = useAdministrativeChange(documentTypeId);
  const numOfStages = useSelector(companySelectors.getCompanyMaxRevisionStage);

  if (!showRevisionSelect) {
    return null;
  }

  const generateVersionPrediction = ( revisionChangeType: RevisionChangeType ) =>
    versionNumber(revisionChangeType, numOfStages, releasedDocRev, isRecord);

  return (
    <Box mt={3}>
      <Typography variant="h6">
        <Text
          message={isRecord ? "document.revision.type.of.update" : revisionSelectLabel}
        />
      </Typography>
      <RadioGroup name="revisionChangeType" validate={validator(required)}>
        <Box>
          {
            showNextRevisionLevel && !showAdministrativeAndVoidChange &&
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
          }
        </Box>
        <Box>
          {
            showNextRevisionStage && !showAdministrativeAndVoidChange && !isAlphaReleased &&
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
          }
        </Box>
        <Box>
          {
            showObsolete && !isDocRevFirstDraft &&
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
          }
        </Box>
        <Box>
          {
            showAdministrationChange && !isDocRevFirstDraft &&
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
          }
        </Box>
      </RadioGroup>
    </Box>
  );
};
export default React.memo(RevisionTypeChange);
