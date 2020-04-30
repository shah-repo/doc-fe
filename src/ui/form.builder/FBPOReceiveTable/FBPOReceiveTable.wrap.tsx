
import React from "react";
import { useIntl } from "react-intl";
import { FB, FBPOReceiveForm, FBPOReceiveFormActions, FBPOReceiveTableProps } from "..";
import FBStore from "../stores/ui/FBStore";

export const withFBPOReceiveTable = <T extends FBPOReceiveTableProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleEdit,
    name,
    ...props
  }: T) => {

    const { dialogState } = FB.useStores();
    const intl = useIntl();

    handleEdit = (_index, item) => () => {
      if (!FBStore.document.document.id) {
        alert(intl.formatMessage({ id: "form.builder.save.doc.before.continue" }));
        return;
      }

      dialogState?.config({
        open: true,
        maxWidth: "sm",
        title: "form.builder.po.items.received",
        content: <FBPOReceiveForm />,
        actions: <FBPOReceiveFormActions {...{ item }} />,
      });
    };

    return Component({
      ...(props as T),
      handleEdit,
    });
  };

  return (props: T) => Comp(props);
};
