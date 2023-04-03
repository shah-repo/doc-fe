import { useFormikContext } from "formik";
import { get, omit } from "lodash";
import React from "react";
import { FB, FBPurchaseOrderActionsProps, FBPurchaseOrderCalculation, FBPurchaseOrderItem } from "..";
import { SM } from "../../../App";
import { GroupTag } from "../../../state/ducks/auth/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import useDialog from "../../hooks/useDialog";
import useGetHasTag from "../../hooks/useGetHasTag";
import { FBFormStateContext } from "../FBForm/FBForm.wrap";
import { COMMON_INITIAL_VALUES, INDIVIDUAL_INITIAL_VALUES } from "../FBInput/FBInput.wrap";
// import useDialog from "../../hooks/useDialog";

export const withFBPurchaseOrderActions = <T extends FBPurchaseOrderActionsProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onAddClick,
    onCancelClick,
    onAlertNotificationCancel,
    onAlertNotificationConfirm,
    dialog,
    ...props
  }: T) => {

    const { purchaseOrderState, dialogState, formState } = FB.useStores();
    const { _formState } = SM.useStores();

    const formik = useFormikContext();

    dialog = useDialog();
    const isUserAdminEnforce = useGetHasTag(GroupTag.DASHBOARD_ADMIN);    // change  DASHBOARD_ADMIN to Enforce_admin

    onAddClick = () => {
      const values = formState?.getValues() as FBPurchaseOrderItem;
      purchaseOrderState?.setItem(values);
      const allItems = purchaseOrderState?.calculateCost() as FBPurchaseOrderCalculation;

      // replace 10000 with upper threshold value of the approver level
      if (isUserAdminEnforce && Number(allItems?.totalAmount) > 10000) {
        return dialog?.open();
      }
      dialogState?.closeDialog();
    };

    onCancelClick = () => {
      dialogState?.closeDialog();
      purchaseOrderState?.setItemTotalAmount();
    };

    onAlertNotificationCancel = () => {
      const values = formState?.getValues() as FBPurchaseOrderItem;
      purchaseOrderState?.removeItem(values);
      if (purchaseOrderState?.value?.items?.length && purchaseOrderState?.value?.items?.length > 0 ) {
      purchaseOrderState?.deleteItem(purchaseOrderState?.value.items.length - 1);
      }
      dialog?.close();
    };

    function setFBValue() {
      const values = get(formik, "values") as DocumentRevision;
      const updatedMode = _formState?.mode;
      switch (updatedMode) {
        case "form":
        case "formDesign": {
          formik.setFieldValue("formDocument", {
            id: values?.formDocument?.id,
          });
          const formStateContext = FBFormStateContext as any;
          formik.setFieldValue("formInput",
            omit(formStateContext?._currentValue,
              [...Object.keys({ ...COMMON_INITIAL_VALUES, ...INDIVIDUAL_INITIAL_VALUES }),
                "partType", "childForRevise"]));
          break;
        }
        default:
          formik.setFieldValue("formTemplate", undefined);
          formik.setFieldValue("formDocument", undefined);
      }
    }

    onAlertNotificationConfirm = () => {
      dialog?.close();
      dialogState?.closeDialog();
      setFBValue();
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
