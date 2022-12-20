import { Box } from "@material-ui/core";
import { observer } from "mobx-react";
import React from "react";
import { FBAutocomplete, FBAutocompleteAsync, FBCheckbox, FBData, FBDatePicker, FBForm, FBPurchaseOrderFormProps, FBPurchaseOrderItemType, FBQuantityField, FBRadioGroup, FBTextField } from "..";
import { FBAutoCompleteStyle, styles } from "../styles/FBAutocomplete.styles";
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
}) => {
  const classes = FBAutoCompleteStyle();
  return  (
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
            labelProps={styles.labelProps}
          />
          <FBTextField
            label="form.builder.field.part.description"
            name="partNumberTitle"
            onChange={handlePartDescription}
            disabled={purchaseOrderState?.hasPartNumber}
            withState
            labelProps={styles.labelProps}
          />
        </>
      )}
      {formState?.newValues.get("type") === "service" && (
        <>
          <FBTextField
            label="form.builder.field.service.id"
            name="serviceId"
            labelProps={styles.labelProps}
          />
          <FBTextField
            label="form.builder.field.description"
            name="description"
            labelProps={styles.labelProps}
          />
        </>
      )}
      <Box display="flex" justifyContent="space-between">
        <Box width="100%" marginRight="10px">
          <FBQuantityField
            label="form.builder.field.qunatity.ordered"
            name="order"
            rules="min:1"
            onChange={handleTotal}
            labelProps={styles.labelProps}
          />
        </Box>
        <Box width="100%" marginLeft="10px" className={classes.root}>
          <FBAutocomplete
            label="form.builder.field.units"
            name="units"
            options={
                  formState?.newValues.get("type") === FBPurchaseOrderItemType.PRODUCT ? FBData.productUnitsOptions
                    : FBData.unitsOptions
            }
            optionValueKey="value"
            optionLabelKey="text"
            inputStyle={styles.inputPropStyle}
            labelProps={styles.labelProps}
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
        labelProps={styles.labelProps}
      />
      <FBTextField
        type="number"
        label="form.builder.field.unit.price"
        name="unitPrice"
        rules="min:0"
        onChange={handleTotal}
        labelProps={styles.labelProps}
      />
      <Box display="flex" justifyContent="flex-start">
        <FBCheckbox
          label="form.builder.field.tax"
          name="tax"
          gutter={false}
          labelProps={styles.labelProps}
        />
        {formState?.newValues.get("type") !== "service" && (
          <FBCheckbox
            label="form.builder.field.capital.equipment"
            name="capitalEquipment"
            gutter={false}
            labelProps={styles.labelProps}
          />
        )}
      </Box>

      {children}
    </ FBForm>
  );
};

export default observer(withFBPurchaseOrderForm(FBPurchaseOrderForm));
