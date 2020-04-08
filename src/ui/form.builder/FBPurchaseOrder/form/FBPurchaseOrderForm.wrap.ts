import { Dictionary } from "lodash";
import moment from "moment";
import React, { useState } from "react";
import { FB } from "../..";
import { TAX_RATE } from "../../helpers/constants";
import { FBPurchaseOrderFormProps, PurchaseOrderItem } from "../FBPurchaseOrder.types";

export const withFBPurchaseOrderForm = <T extends FBPurchaseOrderFormProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    name = "",
    onSubmit,
    initialValues = {} as Dictionary<PurchaseOrderItem>,
    ...props
  }: T) => {
    const { poState } = FB.useStores();
    // Use to prevent re-render and triggering validateOnMount
    const [initialValuesState] = useState(() => initialValues);
    const handleSubmit = (values) => {
      const item = values[`${name}-formValues`];
      const price = item.order * item.unitPrice;
      const totalAmount = item.tax ? (price + (price * TAX_RATE)) : price;
      const formattedDate = moment(item.date).format("MM/DD/YYYY");
      onSubmit({ ...item, totalAmount: totalAmount.toFixed(2), formattedDate });
      props.closeDialog();
    };
    const validateForm = (values) => {
      const item = values[`${name}-formValues`];
      const required = "form.builder.required";
      const errors: any = {
        order: required,
        glCode: required,
        units: required,
        partNumber: required,
        date: required,
        description: required,
        unitPrice: required,
      };

      if (!item) {
        return errors;
      }

      Object.keys(errors).forEach((key) => {
        item[key] && delete errors[key];
      });

      const isUniquePartNumber = !poState.po.items.map((item) => item.partNumber).includes(item.partNumber);
      const isPartNumberInitialValue = initialValuesState[`${name}-formValues`]?.partNumber === item.partNumber;
      if (!isUniquePartNumber && !isPartNumberInitialValue) {
        errors.partNumber = "form.builder.pn.unique";
      }

      return errors;
    };

    return Component({
      ...(props as T),
      poState,
      name,
      onSubmit: handleSubmit,
      validateForm,
      initialValues: initialValuesState,
    });
  };

  return (props: T) => Comp(props);
};
