import { useFormikContext } from "formik";
import { isEmpty } from "lodash";
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
        const totalAmount = Number(allItems.totalAmount) + (Number(values.order) * Number(values.unitPrice));

        // approvalLevels need to replace with poApprovalsState?.approvalsThresholdApi.data after testing API
        const topApprovals = approvalLevels.filter((o1) => approvals.some((o2) => o1.id === o2.id))?.
        sort((a, b) => Number(b?.name.replace("Level ", "")) - Number(a?.name.replace("Level ", "")));

        if ((isEdit && !isEmpty(topApprovals) &&
        Number(totalAmount) > (topApprovals[0]?.limit + topApprovals[0]?.threshold)) || !isEdit) {
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
    id: "de04f0ec-f725-4c2a-a13d-ab94c0e08a11",
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
    id: "e5e57f8d-c8fa-4482-b758-2c56982bd664",
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
    id: "90856827-7aaa-4d5e-8707-f3cb4852ed5b",
    docTypeId: "46150f2a-8807-45c2-ba78-50d7439326df",
    groupId: "6d4bc767-78b6-485d-9871-b3890349af80",
    documentStage: 2,
    approvalType: "PO_APPROVAL",
    limit: 10000000,
    name: "Level 3",
    threshold: 20000,

  },
  {
    createdAt: "2021-03-15T02:18:22.742Z",
    updatedAt: "2021-03-15T02:18:22.742Z",
    id: "f535e0f5-2e41-4da6-b524-0b434ba8631b",
    docTypeId: "46150f2a-8807-45c2-ba78-50d7439326df",
    groupId: "8c0a267d-cd47-4b85-ab66-d621bd06376c",
    documentStage: 1,
    approvalType: "PO_APPROVAL",
    limit: 10000000,
    name: "Level 3",
    threshold: 20000,

  }];
