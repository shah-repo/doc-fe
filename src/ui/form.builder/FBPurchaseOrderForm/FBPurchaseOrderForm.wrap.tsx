import { get, includes, map } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';
import { FB, FBFormState, FBPurchaseOrderFormProps, FBPurchaseOrderItem } from '..';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { generateDocIdLabel } from './helpers';


export const withFBPurchaseOrderForm = <T extends FBPurchaseOrderFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handlePartTitle,
    handleTotal,
    getOptionDisabled,
    getOptionLabel,
    formState,
    initialValues,
    ...props
  }: T) => {

    const { purchaseOrderState } = FB.useStores();
    formState = FB.useRef<FBFormState>(FBFormState, { initialValues });

    React.useEffect(() => {
      const item = formState?.getValues() as FBPurchaseOrderItem;
      purchaseOrderState?.setPartNumber(item.partNumber);
      formState?.setFieldValue('type', get(initialValues, 'type') || 'product');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    handlePartTitle = (_ev: any, value?: DocumentRevision) => {
      const item = formState?.getValues() as FBPurchaseOrderItem;
      const partNumber = item.partNumber;

      purchaseOrderState?.setPartNumber(item.partNumber);
      formState?.setFieldValue('partNumberTitle', partNumber ? value?.name : '', true);
      if (partNumber) {
        formState?.setFieldValue('partNumberDocId', generateDocIdLabel(value));
      } else {
        formState?.omitFieldValue('partNumber');
        formState?.omitFieldValue('partNumberDocId');
      }
    };

    handleTotal = () => {
      const item = formState?.getValues() as FBPurchaseOrderItem;
      purchaseOrderState?.setItemTotalAmount(item);
    };

    React.useEffect(() => reaction(
      () => formState?.newValues.get('type'),
      (type) => {
        formState?.setFieldValue('tax', false, true);
        formState?.setFieldValue('capitalEquipment', false, true);
        formState?.setFieldValue('isTraceabilityRequired', false, true);
        formState?.setFieldValue('partNumber', undefined, true);
        formState?.setFieldValue('supplierPartNumber', undefined, true);
        formState?.setFieldValue('partNumberTitle', undefined, true);
        formState?.setFieldValue('serviceId', '', true);
        formState?.setFieldValue('description', '', true);
        if (type === 'product') {
          formState?.setFieldRules('partNumber', 'required_without:supplierPartNumber');
          formState?.setFieldRules('supplierPartNumber', 'required_without:partNumber');
          formState?.setFieldFinalValidationRules('partNumber', 'required_without:supplierPartNumber');
          formState?.setFieldFinalValidationRules('supplierPartNumber', 'required_without:partNumber');
        }
        else {
          purchaseOrderState?.setPartNumber(undefined);
          formState?.removeFieldRules('partNumber');
          formState?.removeFieldRules('supplierPartNumber');
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    const handlePartDescription = (ev: React.ChangeEvent<any>) => {
      const value = get(ev.target, 'value');
      formState?.setFieldValue('partNumberTitle', value, true);
    };

    getOptionDisabled = (option: DocumentRevision) => {
      const selectedParts = map(purchaseOrderState?.value.items, 'partNumber');
      return includes(selectedParts, option.id);
    };

    getOptionLabel = (option) => generateDocIdLabel(option);

    return Component({
      ...(props as T),
      handlePartTitle,
      handleTotal,
      getOptionDisabled,
      getOptionLabel,
      handlePartDescription,
      purchaseOrderState,
      formState,
    });
  };

  return (props: T) => Comp(props);
};
