import { Box, Typography } from "@material-ui/core";
import React from "react";
import { RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import RadioButton from "../../../components/forms/fields/RadioButton";
import RadioGroup from "../../../components/forms/fields/RadioGroup";
import { required, validator } from "../../../components/forms/fields/validators";
import Text from "../../../components/Text";
import { useAdministrativeChange, useNextRevision, useNextRevisionStage, useObsolete, useRevisionSelect } from "../../../hooks/docCustomization/useCustomization";

interface Props {
  documentTypeId?: string;
  isDisabled: boolean;
  showObsoleteRevisionChange: boolean;
}

export const RevisionTypeChange: React.FunctionComponent<Props> = ({
  documentTypeId = "",
  isDisabled,
  showObsoleteRevisionChange,
}) => {
  const [showRevisionSelect, revisionSelectLabel] = useRevisionSelect(documentTypeId);
  const [showNextRevisionLevel, nextRevisionLevelLabel] = useNextRevision(documentTypeId);
  const [showNextRevisionStage, nextRevisionStageLabel] = useNextRevisionStage(documentTypeId);
  const [showObsolete, obsoleteLabel] = useObsolete(documentTypeId);
  const [showAdministrationChange, administrationChangeLabel] = useAdministrativeChange(documentTypeId);

  if (!showRevisionSelect) {
    return null;
  }

  return (
    <Box mt={7}>
      <Typography variant="h6">
        <Text
          message={revisionSelectLabel}
        />
      </Typography>
      <RadioGroup name="revisionChangeType" validate={validator(required)}>
        {
          showNextRevisionLevel &&
          <RadioButton
            label={<Text message={nextRevisionLevelLabel} />}
            value={RevisionChangeType.NextRevision}
            id="RevisionTypeChange-nextRevision"
            disabled={isDisabled}
          />
        }
        {
          showNextRevisionStage &&
          <RadioButton
            label={
              <Text message={nextRevisionStageLabel} />
            }
            value={RevisionChangeType.NextRevisionStage}
            id="RevisionTypeChange-nextRevisionStage"
            disabled={isDisabled}
          />
        }
        {
          showObsolete && !showObsoleteRevisionChange &&
          <RadioButton
            label={<Text message={obsoleteLabel} />}
            value={RevisionChangeType.Obsolete}
            id="RevisionTypeChange-obsolete"
            disabled={isDisabled}
          />
        }
        {
          showAdministrationChange &&
          <RadioButton
            label={<Text message={administrationChangeLabel} />}
            value={RevisionChangeType.AdministrativeChange}
            id="RevisionTypeChange-administrativeChange"
            disabled={isDisabled}
          />
        }
      </RadioGroup>
    </Box>
  );
};

export default React.memo(RevisionTypeChange);
