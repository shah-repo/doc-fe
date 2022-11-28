import { cloneDeep, find, first, omit } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FB, FBInlineApprovalBody } from "..";
import { SmartReferenceType } from "../../../state/ducks/documentRevisions/types";
import { checkIsDocumentReceivable } from "../../documentRevision/helpers/checkDocumentGroup";
import { getReceivedQuantity } from "../FBPOReceive/utils";
import FBStore from "../FBStore/FBStore";
import FBPurchaseOrderClasses from "./FBPurchaseOrderTable.styles";
import { FBPurchaseOrderTableProps } from "./FBPurchaseOrderTable.types";
import FBPOApprovalsState from "../FBPOApprovals/FBPOApprovals.state";
import { useDispatch } from "react-redux";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import FBDataStore from "../FBStore/FBDataStore";
import { checkGroups, checkLineItems } from "../FBPOApprovals/helpers";

export const withFBPurchaseOrderTable = <T extends FBPurchaseOrderTableProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleShippingCostChange,
    handleTaxChange,
    handleTaxRateChange,
    handleCurrencyChange,
    handleDelete,
    reCalculateValueOnBlur,
    classes,
    calculation,
    loading,
    disabled,
    items,
    name,
    ...props
  }: T) => {

    const { purchaseOrderState, formState, workspaceState } = FB.useStores();
    const isReceivable = checkIsDocumentReceivable(workspaceState?.document?.document.documentType.groupOptions);
    const smartReferencesFrom = workspaceState?.document?.document?.smartReferencesFrom?.filter(
      (ref) => ref.type === SmartReferenceType.LotSoruce);
    classes = FBPurchaseOrderClasses();

    handleTaxChange = (ev: React.ChangeEvent<any>) => purchaseOrderState?.setTax(getDecimalValue(ev, 6));
    handleTaxRateChange = (ev: React.ChangeEvent<any>) => purchaseOrderState?.setTaxRate(getDecimalValue(ev, 6));
    handleShippingCostChange = (ev: React.ChangeEvent<any>) => purchaseOrderState?.setShippingCost(getDecimalValue(ev));

    const getDecimalValue = (ev: React.ChangeEvent<any>, fixedDecimal?: number) => {
      const { target: { value = 0 } = {} } = ev || {};
      const val = Math.abs(value);
      if (val === 0) {
        return val.toFixed(2).toString();
      }

      return val.toFixed(fixedDecimal || 2).toString();
    };

    reCalculateValueOnBlur = () => purchaseOrderState?.reCalculateValue();

    handleCurrencyChange = (ev, currency) => purchaseOrderState?.setCurrency(currency.props.value);

    handleDelete = (index: number) => (e: any) => {
      e.stopPropagation();
      !disabled && purchaseOrderState && purchaseOrderState.deleteItem(index);
    };

    useObserver(() => {
      const value = cloneDeep(purchaseOrderState?.value);
      calculation = omit(value, "items");
      items = cloneDeep(value?.items);
      if (props.mode === "preview") {
        items?.map((item) => {
          const lots = smartReferencesFrom?.filter((ref) => item.id === ref.metadata?.fieldId);
          item.lots = lots?.map((lot) => lot.fromDocument?.docId).join(", ");
        });
      }
      formState?.setFieldValue(name, { ...purchaseOrderState?.value }, true);
      loading = purchaseOrderState?.loading || workspaceState?.loadDocumentRevApi.loading;
      FBStore?.setPurchaseOrderValue(value);
    });

    const dispatch = useDispatch();
    const approvers = useObserver(() => FBDataStore?.refreshData?.approvals
      || workspaceState?.document?.approvals
      || workspaceState?.changeRequest?.approvals) as FBInlineApprovalBody[];
    const poApprovalsState = new FBPOApprovalsState({ approvals: approvers });

    const addApprover = (ids: string[], { manually = true } = {}) => {
      if (!ids.length) {
        return;
      }

      const id = ids[0];
      const groupName = checkGroups({ id, poApprovalsState });
      const poApprovalField = workspaceState?.schema?.find((item) => item.type === "poapprovals");

      poApprovalsState.addApproval({
        assigned: { id },
        type: "MASTER",
        fieldId: poApprovalField?.name,
        partOf: { id: String(workspaceState?.id) },
        signatureGroupName: groupName,
        manually,
      }, () => {
        dispatch(documentRevisionsActions.loadAudit(String(workspaceState?.id)));
      });
    };

    const removeApprover = (ids: string[]) => {
      if (!ids.length) {
        return;
      }

      const id = ids[0];
      const approval = find(poApprovalsState.getApprovals, (a) => a.approver?.id === id);
      poApprovalsState.removeCheckedGroups(approval?.signatureGroupName);
      poApprovalsState.applyTransition("abandon", (approval as FBInlineApprovalBody)?.id, undefined, () => {
        dispatch(documentRevisionsActions.loadAudit(String(workspaceState?.id)));
      });
    };

    useEffect(() => reaction(
      () => purchaseOrderState?.value,
      (value) => {
        formState?.setFieldValue(name, value);
        FBStore?.setPurchaseOrderValue(value);
        workspaceState?.saveDocRev(formState?.getValues());
        if (workspaceState) {
          checkLineItems({
            poItems: value,
            workspaceState,
            poApprovalsState,
            addApprover,
            removeApprover,
          });
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => {
      if (isReceivable)  { purchaseOrderState?.getPartsVersion(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isReceivable) {
      const receivedName = first(workspaceState?.getItemsByType("poreceive"))?.name || "";
      const receivedItems = workspaceState?.getFieldByName(receivedName)?.receivedItems || [];
      items = items?.map( (item) => {
        const id = item.partNumber || item.id;
        const received = getReceivedQuantity(receivedItems, id) || 0;
        return {
          ...item,
          received,
        };
      });
    }

    return Component({
      ...(props as T),
      handleShippingCostChange,
      handleTaxChange,
      handleTaxRateChange,
      handleCurrencyChange,
      handleDelete,
      reCalculateValueOnBlur,
      classes,
      calculation,
      loading,
      disabled,
      items,
      name,
      isReceivable,
    });
  };

  return (props: T) => Comp(props);
};
