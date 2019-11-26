import Box from "@material-ui/core/Box/Box";
import React from "react";
import { withValidatorSchemaSelect } from "../../hocs/validation/withValidatorSchemaSelect";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBValidatorSchemaSelectProps } from "../../types/validation/validatorSchemaSelect";
import FBSelect from "../inputs/FBSelect";

const FBValidatorSchemaSelect: React.FunctionComponent<FBValidatorSchemaSelectProps> = ({
  hasSchemaItem,
  SchemaInputType,
  ...props
}) => (
  <Box>
    <FBSelect
      {...props}
      options={FBValidatorStore.schemaItemOptions}
    />
  {SchemaInputType && SchemaInputType}
  </Box>
);

export default withValidatorSchemaSelect(FBValidatorSchemaSelect);
