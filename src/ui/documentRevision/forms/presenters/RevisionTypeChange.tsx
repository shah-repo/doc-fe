import { Box, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import { documentTypeSelectors, DynamicUIDocTypes } from "../../../../state/ducks/documentRevisions/documentType";
import RadioButton from "../../../components/forms/fields/RadioButton";
import RadioGroup from "../../../components/forms/fields/RadioGroup";
import { required, validator } from "../../../components/forms/fields/validators";
import Text from "../../../components/Text";

interface Props {
  documentTypeId?: string;
}

export const RevisionTypeChange: React.FunctionComponent<Props> = ({
  documentTypeId = "",
}) => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const { documentTypeAcronym: acronym } = documentType || {};
  const isVisible = acronym !== "WO";

  if (!isVisible) {
    return null;
  }

  const hideNextRevisionLevel = acronym === (
    DynamicUIDocTypes.RC ||
    DynamicUIDocTypes.SUP ||
    DynamicUIDocTypes.PO ||
    DynamicUIDocTypes.DAM ||
    DynamicUIDocTypes.ADC
  );

  const hideObsolete = acronym === (
    DynamicUIDocTypes.WO ||
    DynamicUIDocTypes.DAM ||
    DynamicUIDocTypes.ADC
  );

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
        />
        {
          !hideNextRevisionLevel ||
          <RadioButton
            label={
              <Text translation="documentRevision.form.nextRevisionStage" />
            }
            value={RevisionChangeType.NextRevisionStage}
            id="RevisionTypeChange-nextRevisionStage"
          />
        }
        {
          !hideObsolete &&
          <RadioButton
            label={<Text message={`documentRevision.form.obsolete.${acronym}`} />}
            value={RevisionChangeType.Obsolete}
            id="RevisionTypeChange-obsolete"
          />
        }
        <RadioButton
          label={<Text translation="documentRevision.form.administrativeChange" />}
          value={RevisionChangeType.AdministrativeChange}
          id="RevisionTypeChange-administrativeChange"
        />
      </RadioGroup>
    </Box>
  );
};

export default React.memo(RevisionTypeChange);
