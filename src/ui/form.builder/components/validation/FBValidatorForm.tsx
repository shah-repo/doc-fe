import React from "react";
import { withValidatorForm } from "../../hocs/validation/withValidatorForm";
import { FBValidatorFormProps } from "../../types/validation/validatorForm";
import FBForm from "../form/FBForm";
import FBButton from "../inputs/FBButton";
import { Box } from "@material-ui/core";

const FBValidatorForm: React.FunctionComponent<FBValidatorFormProps> = ({
  validators,
  onCustomClick,
}) => (
  <FBForm>
    {validators}
    <Box display="flex" flexDirection="row-reverse" mb={3}>
      <FBButton
        label="form.builder.add.custom.validator"
        variant="text"
        onClick={onCustomClick}
      />
    </Box>
  </FBForm>
);

export default withValidatorForm(FBValidatorForm);
