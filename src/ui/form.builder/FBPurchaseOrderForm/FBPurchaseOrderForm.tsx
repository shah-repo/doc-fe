import { Box } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { FBAutocomplete, FBAutocompleteAsync, FBCheckbox, FBData, FBDatePicker, FBForm, FBPurchaseOrderFormProps, FBQuantityField, FBRadioGroup, FBTextField } from "..";
import { withFBPurchaseOrderForm } from "./FBPurchaseOrderForm.wrap";

const FBPurchaseOrderForm: React.FunctionComponent<FBPurchaseOrderFormProps> = ({
  handlePartTitle,
  handleTotal,
  getOptionDisabled,
  getOptionLabel,
  handlePartDescription,
  purchaseOrderState,
  formState,
  children,
}) => (
  <FBForm {...{ formState }} >
    <FBRadioGroup
      name="type"
      defaultValue="product"
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
    <Observer>
      {() => (
        <>
          {formState?.newValues.get("type") === "product" && (
            <>
              <FBAutocompleteAsync
                label="form.builder.field.part.number"
                name="partNumber"
                optionId="11"
                onChange={handlePartTitle}
                rules="required_without:supplierPartNumber"
                {...{ getOptionDisabled, getOptionLabel }}
              />
              <FBTextField
                label="form.builder.field.supplier.part.number"
                name="supplierPartNumber"
                rules="required_without:partNumber"
              />
              <FBTextField
                label="form.builder.field.part.description"
                name="partNumberTitle"
                onChange={handlePartDescription}
                disabled={purchaseOrderState?.hasPartNumber}
                withState
              />
            </>
          )}
          {formState?.newValues.get("type") === "service" && (
            <>
              <FBTextField
                label="form.builder.field.service.id"
                name="serviceId"
              />
              <FBTextField
                label="form.builder.field.description"
                name="description"
              />
            </>
          )}
        </>
      )}
    </Observer>
    <Box display="flex" justifyContent="space-between">
      <Box width="100%" marginRight="10px">
        <FBQuantityField
          label="form.builder.field.qunatity.ordered"
          name="order"
          rules="min:1"
          onChange={handleTotal}
        />
      </Box>
      <Box width="100%" marginLeft="10px">
        <Observer>
          {() => (
            <FBAutocomplete
              label="form.builder.field.units"
              name="units"
              options={
                formState?.newValues.get("type") === "service" ? FBData.unitsOptions : FBData.productUnitsOptions
              }
              optionValueKey="value"
              optionLabelKey="text"
            />
          )}
        </Observer>
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
    />
    <FBTextField
      type="number"
      label="form.builder.field.unit.price"
      name="unitPrice"
      rules="min:0"
      onChange={handleTotal}
    />
    <Box display="flex" justifyContent="flex-start">
      <FBCheckbox
        label="form.builder.field.tax"
        name="tax"
        gutter={false}
      />
      <Observer>
        {() => (
          <>
            {formState?.newValues.get("type") !== "service" && (
              <FBCheckbox
                label="form.builder.field.capital.equipment"
                name="capitalEquipment"
                gutter={false}
              />
            )}
          </>
        )}
      </Observer>
    </Box>

    {children}
  </ FBForm>
);

export default withFBPurchaseOrderForm(FBPurchaseOrderForm);
