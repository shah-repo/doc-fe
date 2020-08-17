import { Box, Typography } from "@material-ui/core";
import React from "react";
import { RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import RadioButton from "../../../components/forms/fields/RadioButton";
import RadioGroup from "../../../components/forms/fields/RadioGroup";
import { required, validator } from "../../../components/forms/fields/validators";
import Text from "../../../components/Text";
import { useAdministrativeChange, useNextRevision, useNextRevisionStage, useObsolete, useRevisionSelect } from "../../../hooks/docCustomization/useCustomization";
import { styles } from "./RevisionTypeChange.styles";

interface Props {
  documentTypeId?: string;
  isDisabled: boolean;
  showObsoleteRevisionChange: boolean;
  showAdministrativeAndVoidChange: boolean;
}

export const RevisionTypeChange: React.FunctionComponent<Props> = ({
  documentTypeId = "",
  isDisabled,
  showObsoleteRevisionChange,
  showAdministrativeAndVoidChange,
}) => {
  const classes = styles();
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
          showNextRevisionLevel && !showAdministrativeAndVoidChange &&
          <RadioButton
            label={<Text message={nextRevisionLevelLabel} />}
            value={RevisionChangeType.NextRevision}
            id="RevisionTypeChange-nextRevision"
            disabled={isDisabled}
            className={classes.label}
          />
        }
        {
          showNextRevisionStage && !showAdministrativeAndVoidChange &&
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
        }
        {
          showObsolete && !showObsoleteRevisionChange &&
          <RadioButton
            label={<Text message={ showAdministrativeAndVoidChange ? "common.void" : obsoleteLabel} />}
            value={RevisionChangeType.Obsolete}
            id="RevisionTypeChange-obsolete"
            disabled={isDisabled}
            className={classes.label}
          />
        }
        {
          showAdministrationChange &&
          <RadioButton
            label={<Text message={administrationChangeLabel} />}
            value={RevisionChangeType.AdministrativeChange}
            id="RevisionTypeChange-administrativeChange"
            disabled={isDisabled}
            className={classes.label}
          />
        }
      </RadioGroup>
    </Box>
  );
};

export default React.memo(RevisionTypeChange);
