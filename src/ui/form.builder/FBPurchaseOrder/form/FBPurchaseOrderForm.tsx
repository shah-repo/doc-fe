import { Box, Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import { FormattedNumber } from "react-intl";
import { FBAutocomplete } from "../..";
import Text from "../../../components/Text";
import FBButton from "../../components/inputs/FBButton";
import FBCheckbox from "../../components/inputs/FBCheckbox";
import FBDatePicker from "../../components/inputs/FBDatePicker";
import { PurchaseOrderItem } from "../../components/inputs/FBPurchaseOrderField";
import FBTextField from "../../components/inputs/FBTextField";
import { TAX_RATE } from "../../helpers/constants";
import FBStore from "../../stores/ui/FBStore";

interface TotalCostProps {
  order: number;
  unitPrice: number;
  taxRequired: boolean;
}

const TotalCost: React.FunctionComponent<TotalCostProps> = ({
  order = 0,
  unitPrice = 0,
  taxRequired = false,
}) => {
  const totalPrice = React.useMemo(() => {
    const price = order * unitPrice;
    return taxRequired ? (price + (price * TAX_RATE)) : price;
  }
  , [order, unitPrice, taxRequired]);
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

const FBPurchaseOrderForm: React.FunctionComponent<any> = ({
  initialValues = {} as PurchaseOrderItem,
  onSubmit,
  closeDialog,
  items,
  name,
}) => {
  const handleSubmit = () => {};

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form>
        <FBTextField
          inputProps={{ type: "number" }}
          label="form.builder.field.qunatity.ordered"
          name="order"
        />
        <FBAutocomplete
          label="GL code"
          optionId="9"
          name="glCode"
        />
        <FBTextField
          label="form.builder.field.units"
          name="units"
        />
        <FBTextField
          label="form.builder.field.part.number"
          name="partNumber"
        />
        <FBDatePicker
          label="form.builder.field.date.required"
          name="date"
        />
        <FBTextField
          label="form.builder.field.supplier.part.number"
          name="description"
          rows="3"
        />
        <FBTextField
          inputProps={{ type: "number" }}
          label="form.builder.field.unit.price"
          name="unitPrice"
        />
        <FBCheckbox
          label="form.builder.field.capital.equipment"
          name="capitalEquipment"
        />
        <FBCheckbox
          label="form.builder.field.tax"
          name="tax"
        />
        <FBCheckbox
          label="form.builder.field.is.traceability.required"
          name="isTraceabilityRequired"
        />
        <TotalCost
          unitPrice={FBStore.getValue("unitPrice")}
          order={FBStore.getValue("order")}
          taxRequired={FBStore.getValue("tax")}
        />
        <Box marginBottom="10px">
          <Typography color="error">
            errorMessage
          </Typography>
        </Box>
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
    </Formik>
  );
};

export default FBPurchaseOrderForm;
