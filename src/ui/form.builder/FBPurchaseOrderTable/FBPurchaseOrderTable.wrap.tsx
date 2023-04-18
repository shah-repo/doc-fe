import { useFormikContext } from "formik";
import { cloneDeep, compact, each, first, get, omit } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FB, FBPurchaseOrderItem, FBPurchaseOrderValue } from "..";
import { SM } from "../../../App";
import { GroupTag } from "../../../state/ducks/auth/types";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { PO_APPROVAL_KEY, PO_ITEMS_COMPONENT_NAME, PO_REQUESTOR_COMPONENT_NAME } from "../../../state/ducks/documentRevisions/constants";
import { DocumentRevision, DocumentRevisionStatus, SmartReferenceType } from "../../../state/ducks/documentRevisions/types";
import { documentVersionPath } from "../../document.revision/utils/paths";
import { toNewVersionRequestBody } from "../../documentRevision/forms/transform";
import { DocumentRevisionFormValues } from "../../documentRevision/forms/types";
import { checkIsDocumentReceivable } from "../../documentRevision/helpers/checkDocumentGroup";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import useGetHasTag from "../../hooks/useGetHasTag";
import { usePoApprovals } from "../FBPOApprovals/hooks";
import { getReceivedQuantity } from "../FBPOReceive/utils";
import FBDataStore from "../FBStore/FBDataStore";
import FBStore from "../FBStore/FBStore";
import FBPurchaseOrderClasses from "./FBPurchaseOrderTable.styles";
import { FBPurchaseOrderTableProps } from "./FBPurchaseOrderTable.types";
import { checkServiceOrProductPartExists } from "./helpers";

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
    onAlertNotificationConfirm,
    onAlertNotificationCancel,
    classes,
    calculation,
    loading,
    disabled,
    items,
    name,
    dialog,
    ...props
  }: T) => {
    const { purchaseOrderState, formState, workspaceState } = FB.useStores();
    const { document, id, isOutput } = workspaceState || {};
    const formik = useFormikContext();
    const history = useHistory();
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
    const createDocAction = useActionCreator(documentRevisionsActions.create);

    const outputId = isOutput ? id : undefined;
    const isReceivable = checkIsDocumentReceivable(document?.document.documentType.groupOptions);
    const smartReferencesFrom = document?.document?.smartReferencesFrom?.filter(
      (ref) => ref.type === SmartReferenceType.LotSoruce);
    classes = FBPurchaseOrderClasses();
    const isUserAdminEnforce = useGetHasTag(GroupTag.PO_ADMIN);
    dialog = useDialog();
    const isPOEditState = isUserAdminEnforce && workspaceState?.documentStatus === DocumentRevisionStatus.Released
    && SM.isNewVersion;

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
      const values = cloneDeep(get(formik, "values")) as DocumentRevisionFormValues;
      if (values?.formInput) {
        const allItems = values?.formInput[PO_ITEMS_COMPONENT_NAME];
        const previousItems = allItems?.items;
        delete previousItems[selectedItemIndex];
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

        values.formInput[PO_ITEMS_COMPONENT_NAME].items = compact(previousItems);
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

    onAlertNotificationCancel = () => {
      dialog?.close();
    };

    handleDelete = (index: number) => (e: any) => {
      e.stopPropagation();
      setSelectedItemIndex(index);
      if (isPOEditState) {
        return dialog?.open();
      }
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

    const approvalsFieldName = workspaceState?.schema?.find((item) => item.type === "poapprovals")?.name ?? "";

    const {
      addApprover,
      updateApprovals,
      hasUserInApprovers,
      fetchRequiredGroups,
    } = usePoApprovals(
      approvalsFieldName,
      outputId,
    );

    const updateWorkspace = (value?: FBPurchaseOrderValue) => {
      Promise.resolve(workspaceState?.saveDocRev(formState?.getValues()))
        .then(() => Promise.resolve(fetchRequiredGroups()))
        .then(() => updateApprovals({ poItems: value }));
    };

    useEffect(() => reaction(
      () => purchaseOrderState?.value,
      (value) => {
        formState?.setFieldValue(name, value);
        FBStore?.setPurchaseOrderValue(value);

        const requester = formState?.getFieldValue(PO_REQUESTOR_COMPONENT_NAME);
        const hasServiceOrProductPart = value?.items && checkServiceOrProductPartExists(value);
        const hasRequesterInAllApprovers = !hasUserInApprovers(requester);
        const shouldAddApprover = hasServiceOrProductPart && requester && !hasRequesterInAllApprovers;

        if (shouldAddApprover) {
          addApprover(
            [requester],
            { manually: false },
          ).then(() => {
            updateWorkspace(value);
          });
        } else {
          updateWorkspace(value);
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => {
      if (isReceivable) { purchaseOrderState?.getPartsVersion(); }
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
      onAlertNotificationConfirm,
      onAlertNotificationCancel,
      classes,
      calculation,
      loading,
      disabled,
      items,
      name,
      isReceivable,
      dialog,
    });
  };

  return (props: T) => Comp(props);
};
