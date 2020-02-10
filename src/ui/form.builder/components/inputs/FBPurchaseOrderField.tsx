import { Typography } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { withFormik } from "../../../components/hoc/formik";
import FBPurchaseOrderDialog from "../custom/FBPurchaseOrderDialog";
import FBPurchaseOrderTable from "../custom/FBPurchaseOrderTable";

const FBPurchaseOrderField: React.FunctionComponent<any> = ({
  options = [],
  label,
  disabled,
  name,
  ...props
}) => {
  const renderOptions = _.isArray(options) ? options : options.split("\n");
  const sum = renderOptions.reduce(
    (agg, option) =>
      agg + (
        Number(props.form.values[`${props.name}-unit-price-${option.replace(" ", "_")}`] || 0) *
        Number(props.form.values[`${props.name}-quantity-${option.replace(" ", "_")}`] || 0)
      )
    , 0,
  );

  const onSubmit = (values: any) => {
    const purchaseOrders = props.field.value || [];
    props.form.setFieldValue(name, [...purchaseOrders, values]);
  };

  // FBTextField
  return (
    <>
      <div>{label}</div>
      {
        props.field.value &&
        <FBPurchaseOrderTable values={props.field.value} />
      }
      <FBPurchaseOrderDialog
        disabled={disabled}
        onSubmit={onSubmit}
      />
      <Typography variant="h5" align="right">
        Sum: {sum.toFixed(2)}
      </Typography>
    </>
  );
};

export default withFormik(FBPurchaseOrderField);

/*
  <FBInput
    key={option} {...props} label={option} name={`${props.name}-${option.replace(" ", "_")}`} type="purchaseorder"
  >
    <TextField
      fullWidth={false}
      type="number"
      variant="outlined"
      label=""
      {...{placeholder, error, id, InputLabelProps, InputProps, inputProps}}
    />
  </FBInput>
 */
