import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocomplete, FBAutocompleteAsync, FBCheckbox, FBData, FBDatePicker, FBPurchaseOrderFormProps, FBQuantityField, FBRadioGroup, FBTextField } from "..";
import { withFBPurchaseOrderForm } from "./FBPurchaseOrderForm.wrap";

const FBPurchaseOrderForm: React.FunctionComponent<FBPurchaseOrderFormProps> = ({
  handlePartTitle,
  handleTotal,
  getOptionDisabled,
  getOptionLabel,
  handleTypeChange,
  type,
  children,
}) => (
  <>
    <FBRadioGroup
      name="type"
      defaultValue="product"
      onChange={handleTypeChange}
      options={[
        {
          text: "Product",
          value: "product",
        },
        {
          text: "Service",
          value: "service",
        },
      ]}
    />
    <FBQuantityField
      label="form.builder.field.qunatity.ordered"
      name="order"
      rules="required"
      onChange={handleTotal}
    />
    <FBAutocompleteAsync
      label="GL code"
      optionId="9"
      name="glCode"
      rules="required"
    />
    <FBAutocomplete
      label="form.builder.field.units"
      name="units"
      options={FBData.unitsOptions}
      optionValueKey="value"
      optionLabelKey="text"
      rules="required"
    />
    <FBAutocompleteAsync
      label="form.builder.field.part.number"
      name="partNumber"
      optionId="11"
      rules="required"
      onChange={handlePartTitle}
      {...{ getOptionDisabled, getOptionLabel }}
    />
    <FBTextField
      label="form.builder.field.part.number.title"
      name="partNumberTitle"
      disabled
    />
    <FBDatePicker
      label="form.builder.field.date.required"
      name="date"
      rules="required"
    />
    {
      type === "product" &&
      <FBTextField
        label="form.builder.field.supplier.part.number"
        name="description"
        rules="required"
        rows="3"
      />
    }
    <FBTextField
      type="number"
      label="form.builder.field.unit.price"
      name="unitPrice"
      rules="required"
      onChange={handleTotal}
    />
    {
      type === "product" &&
      <Box display="flex" justifyContent="flex-start">
        <FBCheckbox
          label="form.builder.field.tax"
          name="tax"
          gutter={false}
        />
        <FBCheckbox
          label="form.builder.field.capital.equipment"
          name="capitalEquipment"
          gutter={false}
        />
        <FBCheckbox
          label="form.builder.field.is.traceability.required"
          name="isTraceabilityRequired"
          gutter={false}
        />
      </Box>
    }
    {children}
  </>
);

export default withFBPurchaseOrderForm(FBPurchaseOrderForm);
