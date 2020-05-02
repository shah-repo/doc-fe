import React from "react";
import { FB, FBForm, FBPurchaseOrderActions, FBPurchaseOrderForm, FBPurchaseOrderProps } from "..";

export const withFBPurchaseOrder = <T extends FBPurchaseOrderProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleAddItem,
    ...props
  }: T) => {

    const { dialogState } = FB.useStores();

    handleAddItem = () => {
      dialogState?.config({
        open: true,
        maxWidth: "sm",
        title: "form.builder.add.item",
        content: (
          <FBForm>
            <FBPurchaseOrderForm />
          </FBForm>
        ),
        actions: <FBPurchaseOrderActions />,
      });
    };

    return Component({
      ...(props as T),
      handleAddItem,
    });
  };

  return (props: T) => Comp(props);
};
