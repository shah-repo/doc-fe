import { Box, Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import { Dictionary } from "lodash";
import React from "react";
import { FormattedNumber } from "react-intl";
import unitsOptions from "../../../../data/units.json";
import Text from "../../../components/Text";
import FBButton from "../../components/inputs/FBButton";
import FBCheckbox from "../../components/inputs/FBCheckbox";
import FBDatePicker from "../../components/inputs/FBDatePicker";
import FBSelect from "../../components/inputs/FBSelect";
import FBTextField from "../../components/inputs/FBTextField";
import { FBAutocompleteAsync } from "../../FBAutocompleteAsync";
import FBStore from "../../stores/ui/FBStore";
import { FBPurchaseOrderFormProps, PurchaseOrderItem } from "../FBPurchaseOrder.types";
import { default as Error } from "./FBPurchaseOrderError";
import { withFBPurchaseOrderForm } from "./FBPurchaseOrderForm.wrap";

interface TotalCostProps {
  order: number;
  unitPrice: number;
}

const TotalCost: React.FunctionComponent<TotalCostProps> = ({
  order = 0,
  unitPrice = 0,
}) => {
  const totalPrice = React.useMemo(() => (order * unitPrice)
    , [order, unitPrice]);
  return (
    <Box margin="5px 0">
      <Typography variant="h5" align="right">
        <Box minWidth="150px" component="span">
          <Text translation="form.builder.total" />
        </Box>
        <Box minWidth="150px" component="span">
          <FormattedNumber value={totalPrice} style="currency" currency="USD" />
        </Box>
      </Typography>
    </Box>
  );
};

const FBPurchaseOrderForm: React.FunctionComponent<FBPurchaseOrderFormProps> = ({
  initialValues = {} as Dictionary<PurchaseOrderItem>,
  onSubmit,
  closeDialog,
  name,
  validateForm,
  handlePartNumberChange,
}) => {
  const renderForm = (props) => {
    const { errors } = props;
    return (
      <Form>
        <FBTextField
          inputProps={{ type: "number" }}
          label="form.builder.field.qunatity.ordered"
          name={`${name}-formValues.order`}
        />
        <Error error={errors.order} />
        <FBAutocompleteAsync
          label="GL code"
          optionId="9"
          name={`${name}-formValues.glCode`}
        />
        <Error error={errors.glCode} />
        <FBSelect
          label="form.builder.field.units"
          name={`${name}-formValues.units`}
          options={unitsOptions}
          optionValueKey="value"
          optionLabelKey="text"
        />
        <Error error={errors.units} />
        <FBAutocompleteAsync
          label="form.builder.field.part.number"
          name={`${name}-formValues.partNumber`}
          optionId="11"
          onChange={handlePartNumberChange && handlePartNumberChange(props.setFieldValue)}
        />
        <Error error={errors.partNumber} />
        <FBTextField
          label="form.builder.field.part.number.title"
          name={`${name}-formValues.partNumberTitle`}
          disabled
        />
        <FBDatePicker
          label="form.builder.field.date.required"
          name={`${name}-formValues.date`}
        />
        <Error error={errors.date} />
        <FBTextField
          label="form.builder.field.supplier.part.number"
          name={`${name}-formValues.description`}
          rows="3"
        />
        <Error error={errors.description} />
        <FBTextField
          inputProps={{ type: "number" }}
          label="form.builder.field.unit.price"
          name={`${name}-formValues.unitPrice`}
        />
        <Error error={errors.unitPrice} />
        <FBCheckbox
          label="form.builder.field.capital.equipment"
          name={`${name}-formValues.capitalEquipment`}
        />
        <FBCheckbox
          label="form.builder.field.tax"
          name={`${name}-formValues.tax`}
        />
        <FBCheckbox
          label="form.builder.field.is.traceability.required"
          name={`${name}-formValues.isTraceabilityRequired`}
        />
        <TotalCost
          unitPrice={FBStore.getValue(`${name}-formValues.unitPrice`)}
          order={FBStore.getValue(`${name}-formValues.order`)}
        />
        <Box textAlign="right">
          <FBButton
            variant="outlined"
            onClick={closeDialog}
            label="common.cancel"
          />
          <FBButton
            buttonType="submit"
            label="common.done"
          />
        </Box>
      </Form>
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validateForm}
      validateOnChange
      validateOnMount
    >
      {renderForm}
    </Formik>
  );
};

export default withFBPurchaseOrderForm(FBPurchaseOrderForm);
