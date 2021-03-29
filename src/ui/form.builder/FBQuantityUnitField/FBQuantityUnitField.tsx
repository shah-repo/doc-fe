import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocomplete, FBData, FBInput, FBQuantityField, FBQuantityUnitFieldProps } from "..";

const FBQuantityUnitField: React.FunctionComponent<FBQuantityUnitFieldProps> = ({
  name,
  initialValues,
  unitDisabled = false,
  ...props
}) => (
  <FBInput {...props} {...{ name }} type="quantityunit">
    <Box display="flex">
      <FBQuantityField
        label="form.builder.quantity"
        name={`quantity`}
        boxProps={{ mr: 1, flexGrow: 1 }}
      />
      <FBAutocomplete
        label="form.builder.unit"
        name={`unit`}
        boxProps={{ ml: 1, flexGrow: 1 }}
        options={FBData.unitsOptions}
        optionValueKey="value"
        optionLabelKey="text"
        defaultValue={initialValues?.unit}
        disabled={unitDisabled}
      />
    </Box>
  </ FBInput>
);

export default FBQuantityUnitField;
