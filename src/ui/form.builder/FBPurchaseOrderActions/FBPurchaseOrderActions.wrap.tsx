import { useFormikContext } from "formik";
import { cloneDeep, get, isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FB, FBInlineApprovalBody, FBPurchaseOrderActionsProps, FBPurchaseOrderCalculation, FBPurchaseOrderItem } from "..";
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
    const isUserAdminEnforce = useGetHasTag(GroupTag.DASHBOARD_ADMIN);    // change  DASHBOARD_ADMIN to Enforce_admin
    const isPOEditState = isUserAdminEnforce && workspaceState?.documentStatus === DocumentRevisionStatus.Released
                          && SM.isNewVersion;
    const approvals = poApprovalsState?.approvals as FBInlineApprovalBody[];

    useEffect(() => {
      if (workspaceState?.id) {
      poApprovalsState?.fetchApprovalsThreshold(workspaceState?.id);
      }
    }, [poApprovalsState, workspaceState]);

    onAddClick = () => {
      const values = formState?.getValues() as FBPurchaseOrderItem;

      // replace 10000 with upper threshold value of the approver level
      if (isPOEditState) {
        const allItems = purchaseOrderState?.calculateCost() as FBPurchaseOrderCalculation;
        // const totalAmount = Number(allItems.totalAmount);
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
        // console.log("Previous Total Amount :", totalAmount);
        // console.log("Updated Total Amount :", UpdatedAmount);
        // approvalLevels need to replace with poApprovalsState?.ApprovalsThreshold.data after testing API
        const topApprovals = approvalLevels.filter((o1) => approvals.some((o2) => o1.id === o2.id));
        // console.log("topApprovals:::", topApprovals);
        if ((isEdit && !isEmpty(topApprovals) &&
        Number(UpdatedAmount) > (topApprovals[0]?.limit + topApprovals[0]?.threshold)) || !isEdit) {
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


const approvalLevels = [
  {
    createdAt: "2021-03-15T02:18:22.742Z",
    updatedAt: "2021-03-15T02:18:22.742Z",
    id: "31a68a83-b880-4f83-a037-d2118fc37b5a",
    docTypeId: "46150f2a-8807-45c2-ba78-50d7439326df",
    groupId: "65d950c5-3277-4af6-9283-3e361d5b50f0",
    documentStage: 1,
    approvalType: "PO_APPROVAL",
    limit: 5000,
    name: "Level 1",
    threshold: 100,
  },
  {
    createdAt: "2021-03-15T02:18:22.742Z",
    updatedAt: "2021-03-15T02:18:22.742Z",
    id: "748b4cf6-3502-4cd3-9d8c-bf0b10b4cea3",
    docTypeId: "46150f2a-8807-45c2-ba78-50d7439326df",
    groupId: "6ac7289b-2e52-4ac7-84ce-10e48e7c4c1f",
    documentStage: 1,
    approvalType: "PO_APPROVAL",
    limit: 25000,
    name: "Level 2",
    threshold: 200,
  },
  {
    createdAt: "2021-03-15T02:18:22.742Z",
    updatedAt: "2021-03-15T02:18:22.742Z",
    id: "b33a0774-b4b7-43d2-8dc9-d1fa232c8ed1",
    docTypeId: "46150f2a-8807-45c2-ba78-50d7439326df",
    groupId: "6d4bc767-78b6-485d-9871-b3890349af80",
    documentStage: 2,
    approvalType: "PO_APPROVAL",
    limit: 50000,
    name: "Level 3",
    threshold: 200,

  },
  {
    createdAt: "2021-03-15T02:18:22.742Z",
    updatedAt: "2021-03-15T02:18:22.742Z",
    id: "f535e0f5-2e41-4da6-b524-0b434ba8631b",
    docTypeId: "46150f2a-8807-45c2-ba78-50d7439326df",
    groupId: "8c0a267d-cd47-4b85-ab66-d621bd06376c",
    documentStage: 1,
    approvalType: "PO_APPROVAL",
    limit: 100000,
    name: "Level 3",
    threshold: 300,

  }];
