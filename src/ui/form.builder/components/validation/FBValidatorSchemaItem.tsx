import React from "react";
import { withValidatorSchemaItem } from "../../hocs/validation/withValidatorSchemaItem";
import { FBValidatorSchemaItemProps } from "../../types/validation/validatorSchemaItem";

const FBValidatorSchemaItem: React.FunctionComponent<FBValidatorSchemaItemProps> = ({
  type,
  InputType,
  ...props
}) => <InputType {...props} />;

export default withValidatorSchemaItem(FBValidatorSchemaItem);
