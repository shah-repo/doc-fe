import { get } from 'lodash';
import React from 'react';
import { FB, FBFormState, FBPurchaseOrderFormProps, FBPurchaseOrderItem, FBPurchaseOrderItemType } from '..';
import { SM } from '../../../App';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { generateDocIdLabel } from './helpers';

const PART_FIELDS: Array<keyof FBPurchaseOrderItem> = [
  'partNumber',
  'supplierPartNumber',
  'partNumberTitle',
  'partNumberDocumentId',
  'partNumberDocId',
  'capitalEquipment',
  'tax',
];

const SERVICE_FIELDS: Array<keyof FBPurchaseOrderItem> = [
  'serviceId',
  'description',
  'tax',
];

export const withFBPurchaseOrderForm = <T extends FBPurchaseOrderFormProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    handlePartTitle,
    handleTotal,
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

    handlePartTitle = (_ev: unknown, value?: DocumentRevision) => {
      const item = formState?.getValues() as FBPurchaseOrderItem;
      const partNumber = item.partNumber;

      purchaseOrderState?.setPartNumber(item.partNumber);
      formState?.setFieldValue('partNumberTitle', partNumber ? value?.name : '', true);
      if (partNumber) {
        formState?.setFieldValue('partNumberDocId', generateDocIdLabel(value));
        formState?.setFieldValue('partNumberDocumentId', value?.document.id);
      } else {
        formState?.omitFieldValue('partNumber');
        formState?.omitFieldValue('partNumberDocId');
        formState?.omitFieldValue('partNumberDocumentId');
      }
    };

    handleTotal = () => {
      const item = formState?.getValues() as FBPurchaseOrderItem;
      purchaseOrderState?.setItemTotalAmount(item);
    };

    SM.reaction(
      () => String(formState?.newValues.get('type')),
      (type) => {
        switch (type) {
          case FBPurchaseOrderItemType.PRODUCT:
            SERVICE_FIELDS.forEach((field) => {
              formState?.omitFieldValue(field);
              formState?.removeFieldRules(field);
            });
            break;
          case FBPurchaseOrderItemType.SERVICE:
            purchaseOrderState?.setPartNumber(undefined);
            PART_FIELDS.forEach((field) => {
              formState?.omitFieldValue(field);
              formState?.removeFieldRules(field);
            });
            break;
        }
      },
    );

    const handlePartDescription = (ev: React.ChangeEvent<HTMLInputElement>) => {
      const value = get(ev.target, 'value');
      formState?.setFieldValue('partNumberTitle', value, true);
    };

    getOptionLabel = (option) => generateDocIdLabel(option);

    return Component({
      ...(props as T),
      handlePartTitle,
      handleTotal,
      getOptionLabel,
      handlePartDescription,
      purchaseOrderState,
      formState,
    });
  };

  return (props: T) => Comp(props);
};
