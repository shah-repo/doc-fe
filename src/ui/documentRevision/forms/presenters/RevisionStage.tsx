import { Box, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { companySelectors } from "../../../../state/ducks/company";
import { RevisionStageOptions } from "../../../../state/ducks/documentRevisions";
import RadioButton from "../../../components/forms/fields/RadioButton";
import RadioGroup from "../../../components/forms/fields/RadioGroup";
import { required, validator } from "../../../components/forms/fields/validators";
import Text from "../../../components/Text";

interface Props {
  isDisabled: boolean;
}

export const RevisionStage: React.FunctionComponent<Props> = ({
  isDisabled,
}) => {

  const numOfRevStages = useSelector(companySelectors.getCompanyMaxRevisionStage);
  const revStageOptions = numOfRevStages === 2 ?
    RevisionStageOptions.filter((stage) => stage.value !== 2) :
    RevisionStageOptions;

  if (isDisabled) {
    return null;
  }

  return (
    <Box mt={7}>
      <Typography variant="h6">
        <Text message={"document.revision.stage"}/>
      </Typography>
      <RadioGroup name="revisionStage" validate={validator(required)}>
        {revStageOptions.map((option) =>
          <RadioButton
            key={`${option.value}-${option.text}`}
            label={<Text message={option.text} />}
            // had to covert to string
            // if value is number, cheking radio buttons doesn't work correctly
            value={option.value.toString()}
            data-cy={option.text}
            style={{ width: "fit-content" }}
          />)
        }
      </RadioGroup>
    </Box>
  );
};

export default React.memo(RevisionStage);
