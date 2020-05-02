import React from "react";
import { FBAutocompleteAsync, FBCheckbox, FBDatePicker, FBPurchaseOrderFormProps, FBQuantityField, FBTextField } from "..";
import { withFBPurchaseOrderForm } from "./FBPurchaseOrderForm.wrap";


const FBPurchaseOrderForm: React.FunctionComponent<FBPurchaseOrderFormProps> = ({
  handlePartTitle,
  children,
  ...props
}) => (
  <>
    <FBQuantityField
      label="form.builder.field.qunatity.ordered"
      name="order"
      rules="required"
    />
    <FBAutocompleteAsync
      label="GL code"
      optionId="9"
      name="glCode"
      rules="required"
    />
    <FBTextField
      label="form.builder.field.units"
      name="units"
      rules="required"
    />
    <FBAutocompleteAsync
      label="form.builder.field.part.number"
      name="partNumber"
      optionId="11"
      rules="required"
      onChange={handlePartTitle}
      // onChange={handlePartNumberChange && handlePartNumberChange(props.setFieldValue)}
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
    <FBTextField
      label="form.builder.field.supplier.part.number"
      name="description"
      rules="required"
      rows="3"
    />
    <FBTextField
      type="number"
      label="form.builder.field.unit.price"
      name="unitPrice"
      rules="required"
    />
    <FBCheckbox
      label="form.builder.field.capital.equipment"
      name="capitalEquipment"
      gutter={false}
    />
    <FBCheckbox
      label="form.builder.field.tax"
      name="tax"
      gutter={false}
    />
    <FBCheckbox
      label="form.builder.field.is.traceability.required"
      name="isTraceabilityRequired"
      gutter={false}
    />
    {children}
  </>
);

export default withFBPurchaseOrderForm(FBPurchaseOrderForm);
