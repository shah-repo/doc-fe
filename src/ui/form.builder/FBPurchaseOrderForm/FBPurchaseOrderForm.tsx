import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocomplete, FBAutocompleteAsync, FBCheckbox, FBData, FBDatePicker, FBPurchaseOrderFormProps, FBQuantityField, FBRadioGroup, FBTextField } from "..";
import { FormContext } from "../../components/forms/FormContext";
import { withFBPurchaseOrderForm } from "./FBPurchaseOrderForm.wrap";

const FBPurchaseOrderForm: React.FunctionComponent<FBPurchaseOrderFormProps> = ({
  handlePartTitle,
  handleTotal,
  getOptionDisabled,
  getOptionLabel,
  handleTypeChange,
  handlePartDescription,
  type,
  hasPartNumber,
  children,
}) => (
  <FormContext.Provider value={{ submitOnChange: false }}>
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
    {
      type === "product" &&
      <>
        <FBAutocompleteAsync
          label="form.builder.field.part.number"
          name="partNumber"
          optionId="11"
          onChange={handlePartTitle}
          {...{ getOptionDisabled, getOptionLabel }}
        />
        <FBTextField
          label="form.builder.field.part.description"
          name="partNumberTitle"
          onChange={handlePartDescription}
          disabled={hasPartNumber}
        />
      </>
    }
    {
      type === "service" &&
      <>
        <FBTextField
          label="form.builder.field.service.id"
          name="serviceId"
        />
        <FBTextField
          label="form.builder.field.description"
          name="description"
          rules="required"
        />
      </>
    }
    <Box display="flex" justifyContent="space-between">
      <Box width="100%" marginRight="10px">
        <FBQuantityField
          label="form.builder.field.qunatity.ordered"
          name="order"
          rules="required|min:1"
          onChange={handleTotal}
        />
      </Box>
      <Box width="100%" marginLeft="10px">
        <FBAutocomplete
          label="form.builder.field.units"
          name="units"
          rules="required"
          options={type === "service" ? FBData.serviceUnitsOptions : FBData.productUnitsOptions}
          optionValueKey="value"
          optionLabelKey="text"
        />
      </Box>
    </Box>
    <FBAutocompleteAsync
      label="GL code"
      optionId="9"
      name="glCode"
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
      rules="required|min:0"
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
      </Box>
    }
    {children}
  </ FormContext.Provider>
);

export default withFBPurchaseOrderForm(FBPurchaseOrderForm);
