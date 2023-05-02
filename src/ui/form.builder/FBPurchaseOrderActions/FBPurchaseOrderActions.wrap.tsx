import { useFormikContext } from "formik";
import { cloneDeep, each, findIndex, get, size } from "lodash";
import moment from "moment";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FB, FBPurchaseOrderActionsProps, FBPurchaseOrderCalculation, FBPurchaseOrderItem } from "..";
import { SM } from "../../../App";
import { MomentFormats } from "../../../common/utils/date";
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
import { formatCost, getPOLineItemsTotalAndForTaxAmount } from "../FBPurchaseOrderTable/helpers";
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
      if (!purchaseOrderState) {
        return;
      }

      if (isPOEditState) {
        const allItems = purchaseOrderState.calculateCost() as FBPurchaseOrderCalculation;
        const totalAmount = parseFloat(allItems.totalAmount);
        const previousItems = cloneDeep(get(allItems, "items"));
        previousItems[values?.index] = values;

        const UpdatedLineItemsTotalObj = getPOLineItemsTotalAndForTaxAmount(previousItems);
        let tax = 0;
        if (previousItems?.length && UpdatedLineItemsTotalObj.forTax) {
          tax = UpdatedLineItemsTotalObj.forTax * allItems.taxRate / 100;
        }

        const UpdatedAmount =  Number(tax) +  Number(allItems.shippingCost) + Number(UpdatedLineItemsTotalObj.subTotal);
        const topApprovals = poApprovalsState?.approvalLevels?.filter((o1) =>
          (Number(o1.limit) + Number(o1.threshold)) > totalAmount);
        if ((isEdit && topApprovals?.length &&
           Number(UpdatedAmount) > (topApprovals[0]?.limit + topApprovals[0]?.threshold))
        || !isEdit) {
          return dialog?.open();
        }
      }
      purchaseOrderState.setItem(values);
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
      onSuccess: (createdDocumentRevision?: DocumentRevision) => {
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
            formattedDate: newLineItemvalues.date ?
              moment(newLineItemvalues.date).format(MomentFormats.MonthDateYearTwoDigit) : "",
          };
        } else {
          // Add PO Line Item case
          previousItems.push(
            {
              ...newLineItemvalues,
              id: FB.uniqid,
              received: 0,
              totalAmount: purchaseOrderState?.itemTotalAmount.toFixed(2),
              formattedDate: newLineItemvalues.date ?
                moment(newLineItemvalues.date).format(MomentFormats.MonthDateYearTwoDigit) : "",
              index: size(previousItems.items),
            });
        }

        const previousLineItemsLength = previousItems?.length;

        const UpdatedLineItemsTotalObj = getPOLineItemsTotalAndForTaxAmount(previousItems);

        let tax = 0;
        if (previousLineItemsLength && UpdatedLineItemsTotalObj.forTax) {
          tax = UpdatedLineItemsTotalObj.forTax * allItems.taxRate / 100;
        }
        const shippingCost = previousLineItemsLength ? parseFloat(allItems.shippingCost || "0") : 0;
        const totalAmount = tax + UpdatedLineItemsTotalObj.subTotal + shippingCost;
        const totalInUSD = totalAmount * allItems.exchangeRate;

        values.formInput[PO_ITEMS_COMPONENT_NAME] = {
          ...values?.formInput[PO_ITEMS_COMPONENT_NAME],
          subTotal: formatCost(UpdatedLineItemsTotalObj.subTotal),
          tax: formatCost(tax, 6),
          shippingCost: formatCost(shippingCost),
          totalAmount: formatCost(totalAmount),
          totalInUSD: formatCost(totalInUSD),
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
