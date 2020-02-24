import { Box, Typography } from "@material-ui/core";
import React from "react";
import { RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import RadioButton from "../../../components/forms/fields/RadioButton";
import RadioGroup from "../../../components/forms/fields/RadioGroup";
import { required, validator } from "../../../components/forms/fields/validators";
import Text from "../../../components/Text";

export const RevisionTypeChange: React.FunctionComponent = () => (
  <Box mt={7}>
    <Typography variant="h6">
      <Text translation="documentRevision.form.typeOfRevisionChange" />
    </Typography>
    <RadioGroup name="revisionChangeType" validate={validator(required)}>
      <RadioButton
        label={<Text translation="documentRevision.form.nextRevision" />}
        value={RevisionChangeType.NextRevision}
      />
      <RadioButton
        label={
          <Text translation="documentRevision.form.nextRevisionStage" />
        }
        value={RevisionChangeType.NextRevisionStage}
      />
      <RadioButton
        label={<Text translation="documentRevision.form.obsolete" />}
        value={RevisionChangeType.Obsolete}
      />
    </RadioGroup>
  </Box>
);

export default RevisionTypeChange;
