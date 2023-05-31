import { useFormikContext } from 'formik';
import { cloneDeep, compact, each, first, get, isNil, omit, template } from 'lodash';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FB, FBPurchaseOrderItem, FBPurchaseOrderValue } from '..';
import { SM } from '../../../App';
import { getPOIndexDbInstance } from '../../../indexDb';
import { GroupTag } from '../../../state/ducks/auth/types';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { PO_APPROVAL_KEY, PO_ITEMS_COMPONENT_NAME, PO_REQUESTOR_COMPONENT_NAME } from '../../../state/ducks/documentRevisions/constants';
import { DocumentRevision, DocumentRevisionStatus, SmartReferenceType } from '../../../state/ducks/documentRevisions/types';
import { documentVersionPath } from '../../document.revision/utils/paths';
import { toNewVersionRequestBody } from '../../documentRevision/forms/transform';
import { DocumentRevisionFormValues } from '../../documentRevision/forms/types';
import { checkIsDocumentReceivable } from '../../documentRevision/helpers/checkDocumentGroup';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';
import useGetHasTag from '../../hooks/useGetHasTag';
import { FBEndpoint } from '../defaults/FBEndpoint';
import { usePoApprovals } from '../FBPOApprovals/hooks';
import { getReceivedQuantity } from '../FBPOReceive/utils';
import FBDataStore from '../FBStore/FBDataStore';
import FBStore from '../FBStore/FBStore';
import { checkServiceOrProductPartExists, formatCost, getPOLineItemsTotalAndForTaxAmount } from './helpers';
import { FBPurchaseOrderTableProps } from './types';

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
    handleItem,
    calculation,
    loading,
    disabled,
    items,
    name,
    dialog,
    ...props
  }: T) => {
    const { purchaseOrderState, formState, workspaceState, poApprovalsState } = FB.useStores();
    const { document, id, isOutput } = workspaceState || {};
    const formik = useFormikContext();
    const history = useHistory();
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);
    const [isPOAddAction, setIsPOAddAction] = useState<boolean>(false);
    const [isPORemoveAction, setIsPORemoveAction] = useState<boolean>(false);
    const createDocAction = useActionCreator(documentRevisionsActions.create);

    const outputId = isOutput ? id : undefined;
    const isReceivable = checkIsDocumentReceivable(document?.document.documentType.groupOptions);
    const smartReferencesFrom = document?.document?.smartReferencesFrom?.filter(
      (ref) => ref.type === SmartReferenceType.LotSoruce);
    const isUserAdminEnforce = useGetHasTag(GroupTag.PO_ADMIN);
    dialog = useDialog();
    const isPOEditState = isUserAdminEnforce && workspaceState?.documentStatus === DocumentRevisionStatus.Released
      && SM.isNewVersion;
    const updatedValues = useRef({ shippingCost: '0', tax: '0', taxRate: '0', currency: 'USD', exchangeRate: 1 });

    const isTotalAmountUnderThreshold = (shippingCost, tax, taxRate, exchangeRate?, currency?) => {
      if (isPOEditState) {
        const allItems = purchaseOrderState?.calculateCost();
        const totalAmount = parseFloat(allItems?.totalInUSD ?? '0');
        let UpdatedAmount = parseFloat(allItems?.subTotal ?? '0');
        if (shippingCost) {
          UpdatedAmount += parseFloat(allItems?.tax ?? '0') + parseFloat(shippingCost);
        } else if (tax) {
          UpdatedAmount += parseFloat(tax ?? '0') + parseFloat(allItems?.shippingCost ?? '0');
        } else if (taxRate) {
          const sum = getPOLineItemsTotalAndForTaxAmount(allItems?.items as FBPurchaseOrderItem[]);
          let tax = 0;
          if (allItems?.items.length && sum.forTax && !isNil(taxRate)) {
            tax = sum.forTax * parseFloat(taxRate ?? '0') / 100;
          }
          UpdatedAmount += tax + parseFloat(allItems?.shippingCost ?? '0');
        }
        if (!isNil(exchangeRate)) {
          UpdatedAmount = parseFloat(allItems?.totalAmount ?? '0') * exchangeRate;
        }
        const topApprovals = poApprovalsState?.approvalLevels?.filter((o1) =>
          (o1.limit + o1.threshold) >= totalAmount);
        if (topApprovals?.length
         && UpdatedAmount > (topApprovals[0]?.limit + topApprovals[0]?.threshold)
        ) {
          updatedValues.current = { ...{ shippingCost, tax, taxRate, exchangeRate: exchangeRate ?? allItems?.exchangeRate, currency: currency ?? allItems?.currency } };
           dialog?.open();
           return false;
        } else {
          return true;
        }
      }
    };

    handleTaxChange = (ev: React.ChangeEvent<any>) => {
      if (isPOEditState && !isTotalAmountUnderThreshold(null, getDecimalValue(ev, 6), null)) {
        return;
      }
      purchaseOrderState?.setTax(getDecimalValue(ev, 6));
    };
    handleTaxRateChange = (ev: React.ChangeEvent<any>) => {
      if (isPOEditState && !isTotalAmountUnderThreshold(null, null, getDecimalValue(ev, 6))) {
        return;
      }
      purchaseOrderState?.setTaxRate(getDecimalValue(ev, 6));
    };
    handleShippingCostChange = (ev: React.ChangeEvent<any>) => {
      if (isPOEditState && !isTotalAmountUnderThreshold(getDecimalValue(ev), null, null)) {
        return;
      }
      purchaseOrderState?.setShippingCost(getDecimalValue(ev));
    };

    const getDecimalValue = (ev: React.ChangeEvent<any>, fixedDecimal?: number) => {
      const { target: { value = 0 } = {} } = ev || {};
      const val = Math.abs(value);
      if (val === 0) {
        return val.toFixed(2).toString();
      }

      return val.toFixed(fixedDecimal || 2).toString();
    };

    reCalculateValueOnBlur = () => purchaseOrderState?.reCalculateValue();

    useEffect(() => {
      if (workspaceState?.id) {
        poApprovalsState?.fetchApprovalsThreshold();
      }
    }, [poApprovalsState, workspaceState]);

    handleCurrencyChange = async (ev, currency) => {
      const selectedCurrency = currency.props.value;
      if (isPOEditState) {
        const urlTpl = template(FBEndpoint.Currency);
        const url = urlTpl({ symboName: selectedCurrency });
        purchaseOrderState?.exchangeRate.setUrl(url);
        const data = await purchaseOrderState?.exchangeRate?.fetch();
        if (!isTotalAmountUnderThreshold(null, null, null, data?.rate, selectedCurrency)) {
          return;
        }
      }
      purchaseOrderState?.setCurrency(selectedCurrency);
    };

    const async = useAsync<DocumentRevision>({
      onSuccess: async (createdDocumentRevision?) => {
        if (createdDocumentRevision) {
          dialog?.close();
          try {
            const prevPODoc = await getPOIndexDbInstance().toArray();
            if (prevPODoc.length) {
              await workspaceState?.updateDocRevById(getLatestDocRevData(true) as DocumentRevision, createdDocumentRevision.id);
              await workspaceState?.undoPO(prevPODoc[0] as DocumentRevision);
            }
          } catch (e) {
            console.error(e);
          }
          FBDataStore.setRefreshData(undefined);
          await getPOIndexDbInstance().clear();
          documentRevisionsActions.loadDocument(createdDocumentRevision.document.id);
          history.push(
            documentVersionPath(createdDocumentRevision.id, createdDocumentRevision.document.id),
          );
        }
      },
    });

    onAlertNotificationConfirm = async () => {
      if (isPOEditState && isPOAddAction && handleItem) {
        handleItem();
        setIsPOAddAction(false);
        dialog?.close();
        return;
      }
      const latestDocRevData = getLatestDocRevData(false);
      try {
        const prevPODoc = await getPOIndexDbInstance().toArray() as DocumentRevision[];
        if (latestDocRevData && prevPODoc.length) {
          latestDocRevData.formInput = prevPODoc[0]?.formInput;
          latestDocRevData.description = prevPODoc[0]?.description;
        }
      } catch (e) { }
      async.start(createDocAction, latestDocRevData, async);
    };

    onAlertNotificationCancel = () => {
      setIsPOAddAction(false);
      setIsPORemoveAction(false);
      setSelectedItemIndex(-1);
      updatedValues.current = { shippingCost: '0', tax: '0', taxRate: '0', currency: purchaseOrderState?.value?.currency ?? 'USD', exchangeRate: purchaseOrderState?.value?.exchangeRate ?? 1 };
      dialog?.close();
    };

    const onAddLineItemClick = () => {
      if (isPOEditState) {
        setIsPOAddAction(true);
        dialog?.open();
        return;
      }
      handleItem?.();
    };

    const getShippingCost = (shippingCost): number => {
      return (isPOEditState && updatedValues.current?.shippingCost)
        ? parseFloat(updatedValues.current?.shippingCost)
        : Number(shippingCost || '0');
    };

    const getLatestDocRevData = (deleteLineItem) => {
      const values = cloneDeep(get(formik, 'values')) as DocumentRevisionFormValues;
      if (!values?.formInput) {
        return;
      }
      const allItems = values?.formInput[PO_ITEMS_COMPONENT_NAME] as FBPurchaseOrderValue;
      const previousItems = cloneDeep(allItems?.items);
      if (deleteLineItem && selectedItemIndex >= 0) {
        delete previousItems[selectedItemIndex];
      }
      const previousLineItemsLength = previousItems?.length;
      const UpdatedLineItemsTotalObj = getPOLineItemsTotalAndForTaxAmount(previousItems);
      let taxRate = allItems.taxRate;
      let tax = 0;
      if (isPOEditState && updatedValues.current?.tax) {
        tax = parseFloat(updatedValues.current?.tax);
        taxRate = purchaseOrderState?.getTaxRateByTax(updatedValues.current?.tax) as number;
      } else if (previousLineItemsLength && UpdatedLineItemsTotalObj.forTax) {
        tax = UpdatedLineItemsTotalObj.forTax * allItems.taxRate / 100;
      }
      if (isPOEditState && updatedValues.current?.taxRate) {
        taxRate = Number(updatedValues.current?.taxRate);
        if (previousLineItemsLength && UpdatedLineItemsTotalObj.forTax && !isNil(updatedValues.current?.taxRate)) {
          tax = UpdatedLineItemsTotalObj.forTax * taxRate / 100;
        }
      }
      const shippingCost = previousLineItemsLength ? getShippingCost(allItems.shippingCost) : 0;
      const totalAmount = tax + UpdatedLineItemsTotalObj.subTotal + shippingCost;
      const totalInUSD = totalAmount * updatedValues.current?.exchangeRate ?? allItems.exchangeRate;

      values.formInput[PO_ITEMS_COMPONENT_NAME] = {
        ...values?.formInput[PO_ITEMS_COMPONENT_NAME],
        subTotal: formatCost(UpdatedLineItemsTotalObj.subTotal),
        tax: formatCost(tax, 6),
        taxRate: taxRate,
        shippingCost: formatCost(shippingCost),
        totalAmount: formatCost(totalAmount),
        currency: updatedValues.current?.currency,
        exchangeRate: updatedValues.current?.exchangeRate,
        totalInUSD: formatCost(totalInUSD),
      };

      values.formInput[PO_ITEMS_COMPONENT_NAME].items = compact(previousItems);
      values.formDocument = { id: workspaceState?.document?.formDocument?.id };

      each(values.formInput[PO_ITEMS_COMPONENT_NAME], (value, key) => {
        if (values?.formInput && key.includes(PO_APPROVAL_KEY)) {
          values.formInput[PO_ITEMS_COMPONENT_NAME][key] = undefined;
        }
      });
      return cloneDeep(toNewVersionRequestBody(cloneDeep(values)));
    };

    handleDelete = (index: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setSelectedItemIndex(index);
      if (isPOEditState) {
        setIsPORemoveAction(true);
        dialog?.open();
        return;
      }
      !disabled && purchaseOrderState && purchaseOrderState.deleteItem(index);
    };

    useObserver(() => {
      const value = cloneDeep(purchaseOrderState?.value);
      calculation = omit(value, 'items');
      items = cloneDeep(value?.items);
      if (props.mode === 'preview') {
        items?.map((item) => {
          const lots = smartReferencesFrom?.filter((ref) => item.id === ref.metadata?.fieldId);
          item.lots = lots?.map((lot) => lot.fromDocument?.docId).join(', ');
        });
      }
      formState?.setFieldValue(name, { ...purchaseOrderState?.value }, true);
      loading = purchaseOrderState?.loading || workspaceState?.loadDocumentRevApi.loading;
      FBStore?.setPurchaseOrderValue(value);
    });

    const approvalsFieldName = workspaceState?.schema?.find((item) => item.type === 'poapprovals')?.name ?? '';

    const {
      addApprover,
      updateApprovals,
      hasUserInApprovers,
      fetchRequiredGroups,
    } = usePoApprovals(
      approvalsFieldName,
      outputId,
    );

    const updateWorkspace = async (value?: FBPurchaseOrderValue) => {
      await workspaceState?.saveDocRev(formState?.getValues());
      await Promise.resolve(fetchRequiredGroups());
      await updateApprovals({ poItems: value });
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
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => {
      if (isReceivable) { purchaseOrderState?.getPartsVersion(); }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isReceivable) {
      const receivedName = first(workspaceState?.getItemsByType('poreceive'))?.name || '';
      const receivedItems = workspaceState?.getFieldByName(receivedName)?.receivedItems || [];
      let isReceivedAll = true;
      items = items?.map((item) => {
        const id = item.partNumber || item.id;
        const received = getReceivedQuantity(receivedItems, id) || 0;
        if (received < item.order && isReceivedAll) {
          isReceivedAll = false;
        }
        return {
          ...item,
          received,
        };
      });
      purchaseOrderState?.setIsAllItemsReceived(isReceivedAll);
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
      onAddLineItemClick,
      calculation,
      loading,
      disabled,
      items,
      name,
      isReceivable,
      isPOAddAction,
      isPORemoveAction,
      handleItem,
      dialog,
    });
  };

  return (props: T) => Comp(props);
};
