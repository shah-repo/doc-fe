import { useFormikContext } from "formik";
import { get } from "lodash";
import React from "react";
import { FB, FBPurchaseOrderActionsProps, FBPurchaseOrderCalculation, FBPurchaseOrderItem, FBWorkspaceModeOptions } from "..";
import { SM } from "../../../App";
import { GroupTag } from "../../../state/ducks/auth/types";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import useDialog from "../../hooks/useDialog";
import useGetHasTag from "../../hooks/useGetHasTag";

export const withFBPurchaseOrderActions = <T extends FBPurchaseOrderActionsProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onAddClick,
    onCancelClick,
    onAlertNotificationCancel,
    onAlertNotificationConfirm,
    dialog,
    isEdit = false,
    ...props
  }: T) => {

    const { purchaseOrderState, dialogState, formState, workspaceState } = FB.useStores();
    const { _formState } = SM.useStores();

    const formik = useFormikContext();

    dialog = useDialog();
    const isUserAdminEnforce = useGetHasTag(GroupTag.DASHBOARD_ADMIN);    // change  DASHBOARD_ADMIN to Enforce_admin

    onAddClick = () => {
      const values = formState?.getValues() as FBPurchaseOrderItem;
      purchaseOrderState?.setItem(values);
      const allItems = purchaseOrderState?.calculateCost() as FBPurchaseOrderCalculation;

      // replace 10000 with upper threshold value of the approver level
      if (isUserAdminEnforce &&
        ((isEdit && Number(allItems?.totalAmount) > 10000) || !isEdit)
      && workspaceState?.documentStatus === DocumentRevisionStatus.Released) {
        return dialog?.open();
      }
      dialogState?.closeDialog();
    };

    onCancelClick = () => {
      dialogState?.closeDialog();
      purchaseOrderState?.setItemTotalAmount();
    };

    onAlertNotificationCancel = () => {
      if (!isEdit) {
        const values = formState?.getValues() as FBPurchaseOrderItem;
        purchaseOrderState?.removeItem(values);
        if (purchaseOrderState?.value?.items?.length && purchaseOrderState?.value?.items?.length > 0 ) {
          purchaseOrderState?.deleteItem(purchaseOrderState?.value.items.length - 1);
        }
      }
      dialog?.close();
      dialogState?.closeDialog();
    };

    function setFormDocumentValue() {
      const values = get(formik, "values") as DocumentRevision;
      const updatedMode = _formState?.mode;
      if (updatedMode === FBWorkspaceModeOptions.FORM) {
        formik.setFieldValue("formDocument", {
          id: values?.formDocument?.id,
        });
      }
    }

    onAlertNotificationConfirm = () => {
      dialog?.close();
      dialogState?.closeDialog();
      setFormDocumentValue();
      formik.submitForm();
    };

    return Component({
      ...(props as T),
      onAddClick,
      onCancelClick,
      onAlertNotificationCancel,
      onAlertNotificationConfirm,
      purchaseOrderState,
      dialog,
    });
  };

  return (props: T) => Comp(props);
};
