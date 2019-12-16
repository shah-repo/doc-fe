import { Box } from "@material-ui/core";
import React from "react";
import { withValidatorForm } from "../../hocs/validation/withValidatorForm";
import { FBValidatorFormProps } from "../../types/validation/validatorForm";
import FBDialog from "../feedback/FBDialog";
import FBForm from "../form/FBForm";
import FBButton from "../inputs/FBButton";

const FBValidatorForm: React.FunctionComponent<FBValidatorFormProps> = ({
  validators,
  onCustomClick,
  ...props
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
    <FBDialog {...props} title="form.builder.export.template">
      <Box> ValidationDialog</Box>
    </FBDialog>
  </FBForm>
);

export default withValidatorForm(FBValidatorForm);
