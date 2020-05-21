import { Box, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import { documentTypeSelectors, DynamicUIDocTypes } from "../../../../state/ducks/documentRevisions/documentType";
import RadioButton from "../../../components/forms/fields/RadioButton";
import RadioGroup from "../../../components/forms/fields/RadioGroup";
import { required, validator } from "../../../components/forms/fields/validators";
import Text from "../../../components/Text";

interface Props {
  documentTypeId?: string;
  isDisabled: boolean;
}

export const RevisionTypeChange: React.FunctionComponent<Props> = ({
  documentTypeId = "",
  isDisabled,
}) => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const { documentTypeAcronym: acronym } = documentType || {};
  const isVisible = acronym !== DynamicUIDocTypes.WO;
  const showNextRevisionLevel = useMemo(() => {
    switch (acronym) {
      case DynamicUIDocTypes.PO:
      case DynamicUIDocTypes.RC:
      case DynamicUIDocTypes.SUP:
      case DynamicUIDocTypes.DAM:
      case DynamicUIDocTypes.POAM:
        return false;
      default:
        return true;
    }
  }, [acronym]);
  const showObsolete = useMemo(() => {
    switch (acronym) {
      case DynamicUIDocTypes.WO:
      case DynamicUIDocTypes.DAM:
      case DynamicUIDocTypes.POAM:
        return false;
      default:
        return true;
    }
  }, [acronym]);

  if (!isVisible) {
    return null;
  }

  return (
    <Box mt={7}>
      <Typography variant="h6">
        <Text
          message={`documentRevision.form.typeOfRevisionChange.${acronym}`}
        />
      </Typography>
      <RadioGroup name="revisionChangeType" validate={validator(required)}>
        <RadioButton
          label={<Text message={`documentRevision.form.nextRevision.${acronym}`} />}
          value={RevisionChangeType.NextRevision}
          id="RevisionTypeChange-nextRevision"
          disabled={isDisabled}
        />
        {
          showNextRevisionLevel &&
          <RadioButton
            label={
              <Text translation="documentRevision.form.nextRevisionStage" />
            }
            value={RevisionChangeType.NextRevisionStage}
            id="RevisionTypeChange-nextRevisionStage"
            disabled={isDisabled}
          />
        }
        {
          showObsolete &&
          <RadioButton
            label={<Text message={`documentRevision.form.obsolete.${acronym}`} />}
            value={RevisionChangeType.Obsolete}
            id="RevisionTypeChange-obsolete"
            disabled={isDisabled}
          />
        }
        <RadioButton
          label={<Text translation="documentRevision.form.administrativeChange" />}
          value={RevisionChangeType.AdministrativeChange}
          id="RevisionTypeChange-administrativeChange"
          disabled={isDisabled}
        />
      </RadioGroup>
    </Box>
  );
};

export default React.memo(RevisionTypeChange);
