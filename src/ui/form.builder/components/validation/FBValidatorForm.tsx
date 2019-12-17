import React from "react";
import { withValidatorForm } from "../../hocs/validation/withValidatorForm";
import { FBValidatorFormProps } from "../../types/validation/validatorForm";
import FBForm from "../form/FBForm";

const FBValidatorForm: React.FunctionComponent<FBValidatorFormProps> = ({
  validators,
}) => (
  <FBForm>
    {validators}
  </FBForm>
);

export default withValidatorForm(FBValidatorForm);
