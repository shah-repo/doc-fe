import { useFormikContext } from "formik";
import { cloneDeep, get, isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FB, FBPurchaseOrderActionsProps, FBPurchaseOrderCalculation, FBPurchaseOrderItem } from "..";
import { SM } from "../../../App";
import { GroupTag } from "../../../state/ducks/auth/types";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { documentVersionPath } from "../../document.revision/utils/paths";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import useGetHasTag from "../../hooks/useGetHasTag";
import { createNewDocRev } from "../FBPurchaseOrderForm/helpers";

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

    const { purchaseOrderState, dialogState, formState, workspaceState, poApprovalsState } = FB.useStores();
    const history = useHistory();
    const createDocAction = useActionCreator(documentRevisionsActions.create);

    const formik = useFormikContext();

    dialog = useDialog();
    const isUserAdminEnforce = useGetHasTag(GroupTag.PO_ADMIN);
    const isPOEditState = isUserAdminEnforce && workspaceState?.documentStatus === DocumentRevisionStatus.Released
                          && SM.isNewVersion;

    useEffect(() => {
      if (workspaceState?.id) {
        poApprovalsState?.fetchApprovalsThreshold();
      }
    }, [poApprovalsState, workspaceState]);

    onAddClick = () => {
      const values = formState?.getValues() as FBPurchaseOrderItem;

      if (isPOEditState) {
        const allItems = purchaseOrderState?.calculateCost() as FBPurchaseOrderCalculation;
        const totalAmount = Number(allItems.totalAmount);
        const previousItems = cloneDeep(get(allItems, "items"));
        previousItems[values?.index] = values;

        const UpdatedLineItemsTotalObj = previousItems?.reduce(
          (agg, item: FBPurchaseOrderItem) => {
            const orderCost = Number(item.unitPrice || 0) * Number(item.order || 0);
            agg.subTotal += orderCost;
            agg.forTax += item.tax ? orderCost : 0;
            return agg;
          }, { subTotal: 0, forTax: 0 });
        let tax = 0;
        if (previousItems?.length && UpdatedLineItemsTotalObj.forTax) {
          tax = UpdatedLineItemsTotalObj.forTax * allItems.taxRate / 100;
        }

        const UpdatedAmount =  Number(tax) +  Number(allItems.shippingCost) + Number(UpdatedLineItemsTotalObj.subTotal);
        const topApprovals = poApprovalsState?.approvalLevels?.filter((o1) =>
          (Number(o1.limit) + Number(o1.threshold)) > totalAmount);
        if ((isEdit && !isEmpty(topApprovals) &&
        topApprovals?.length && Number(UpdatedAmount) > (topApprovals[0]?.limit + topApprovals[0]?.threshold))
        || !isEdit) {
          return dialog?.open();
        }
      }
      purchaseOrderState?.setItem(values);
      dialogState?.closeDialog();
    };

    onCancelClick = () => {
      dialogState?.closeDialog();
      purchaseOrderState?.setItemTotalAmount();
    };

    onAlertNotificationCancel = () => {
      dialog?.close();
      dialogState?.closeDialog();
    };

    const async = useAsync<DocumentRevision>({
      onSuccess: (createdDocumentRevision?) => {
        if (createdDocumentRevision) {
          documentRevisionsActions.loadDocument(createdDocumentRevision.document.id);
          history.push(
            documentVersionPath(createdDocumentRevision.id, createdDocumentRevision.document.id),
          );
        }
      },
    });

    onAlertNotificationConfirm = () => {
      createNewDocRev(formik, workspaceState, async, createDocAction);
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
