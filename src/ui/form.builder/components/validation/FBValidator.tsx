import React from "react";
import { withValidator } from "../../hocs/validation/withValidator";
import { FBValidatorProps } from "../../types/validation/validator";
import FBForm from "../form/FBForm";

const FBValidator: React.FunctionComponent<FBValidatorProps> = ({
  validators,
}) => <FBForm>{validators}</FBForm>;

export default withValidator(FBValidator);
