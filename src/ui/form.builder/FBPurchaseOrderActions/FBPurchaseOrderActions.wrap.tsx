import { useFormikContext } from "formik";
import { cloneDeep, each, findIndex, get, isEmpty, size } from "lodash";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FB, FBPurchaseOrderActionsProps, FBPurchaseOrderCalculation, FBPurchaseOrderItem } from "..";
import { SM } from "../../../App";
import { GroupTag } from "../../../state/ducks/auth/types";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { PO_APPROVAL_KEY, PO_ITEMS_COMPONENT_NAME } from "../../../state/ducks/documentRevisions/constants";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { documentVersionPath } from "../../document.revision/utils/paths";
import { toNewVersionRequestBody } from "../../documentRevision/forms/transform";
import { DocumentRevisionFormValues } from "../../documentRevision/forms/types";
import { isDocumentRevisionReleased } from "../../documentRevision/helpers/documentRevisionStatus";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import useGetHasTag from "../../hooks/useGetHasTag";
import FBDataStore from "../FBStore/FBDataStore";

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
    const isPOEditState = isUserAdminEnforce && isDocumentRevisionReleased(workspaceState?.documentStatus)
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

    onAlertNotificationCancel = (event) => {
      dialog?.close();
      event.preventDefault();
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
      const newLineItemvalues = formState?.getValues() as FBPurchaseOrderItem;
      const values = cloneDeep(get(formik, "values")) as DocumentRevisionFormValues;
      if (values?.formInput) {
        const allItems = purchaseOrderState?.calculateCost() as FBPurchaseOrderCalculation;
        const previousItems = cloneDeep(get(allItems, "items"));
        if (newLineItemvalues?.id) {
          // Edit PO Line Item case
          const index = findIndex(previousItems, (data: FBPurchaseOrderItem) => data.id === newLineItemvalues?.id);
          previousItems[index] = {
            ...newLineItemvalues,
            totalAmount: purchaseOrderState?.itemTotalAmount.toFixed(2),
            formattedDate: purchaseOrderState?.formatDate(newLineItemvalues.date),
          };
        } else {
          // Edit PO Line Item case
          previousItems.push(
            {
              ...newLineItemvalues,
              id: FB.uniqid,
              received: 0,
              totalAmount: purchaseOrderState?.itemTotalAmount.toFixed(2),
              formattedDate: purchaseOrderState?.formatDate(newLineItemvalues.date),
              index: size(previousItems.items),
            });
        }

        const previousLineItemsLength = previousItems?.length;

        const UpdatedLineItemsTotalObj = previousItems?.reduce(
        (agg, item: FBPurchaseOrderItem) => {
          const orderCost = Number(item.unitPrice || 0) * Number(item.order || 0);
          agg.subTotal += orderCost;
          agg.forTax += item.tax ? orderCost : 0;
          return agg;
        }, { subTotal: 0, forTax: 0 });

        let tax = 0;
        if (previousLineItemsLength && UpdatedLineItemsTotalObj.forTax) {
          tax = UpdatedLineItemsTotalObj.forTax * allItems.taxRate / 100;
        }
        const shippingCost = previousLineItemsLength ? allItems.shippingCost || 0 : 0;
        const totalAmount = tax + UpdatedLineItemsTotalObj.subTotal + Number(shippingCost);
        const totalInUSD = totalAmount * allItems.exchangeRate;

        values.formInput[PO_ITEMS_COMPONENT_NAME] = {
          ...values?.formInput[PO_ITEMS_COMPONENT_NAME],
          subTotal: purchaseOrderState?.formatCost(UpdatedLineItemsTotalObj.subTotal),
          tax: purchaseOrderState?.formatCost(tax, 6),
          shippingCost: purchaseOrderState?.formatCost(shippingCost),
          totalAmount: purchaseOrderState?.formatCost(totalAmount),
          totalInUSD: purchaseOrderState?.formatCost(totalInUSD),
        };

        values.formInput[PO_ITEMS_COMPONENT_NAME].items = previousItems;
        values.formDocument = { id: workspaceState?.document?.formDocument?.id };

        each(values.formInput[PO_ITEMS_COMPONENT_NAME], (value, key) => {
          if (values?.formInput && key.includes(PO_APPROVAL_KEY)) {
            values.formInput[PO_ITEMS_COMPONENT_NAME][key] = undefined;
          }
        });
        const promise = async.start(createDocAction, toNewVersionRequestBody(values), async);
        promise?.then(() => {
          FBDataStore?.setRefreshData({
            ...values,
          });
        });
      }
    };

    return Component({
      ...(props as T),
      onAddClick,
      onCancelClick,
      onAlertNotificationCancel,
      onAlertNotificationConfirm,
      purchaseOrderState,
      isEdit,
      dialog,
    });
  };

  return (props: T) => Comp(props);
};
