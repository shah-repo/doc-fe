import { useObserver } from 'mobx-react';
import { FB } from '..';
import { DEDUCTABLE_TRANSFER_TYPES, INITIAL_QUANTITY_FIELD, TRANSFERS_FIELD } from './constants';
import { LotTransfer, LotTransferType } from './types';

interface UseOnHandQuantityType {
  initialQuantity: number | undefined
  onHandQuantity: number
  onHandQuantityFiltered: number
  onHandQuantityUnit: string
}

const calculateSumForTransfer = (transfer: LotTransfer, sum: number) => {
  const shouldDeduct = DEDUCTABLE_TRANSFER_TYPES.includes(transfer.type);
  const shouldAdd = transfer.type !== LotTransferType.Move;
  if (shouldDeduct) {
    return sum - transfer.quantity;
  }
  if (shouldAdd) {
    return sum + transfer.quantity;
  }
  return sum;
};

export const useOnHandQuantity = (skipTransfer?: string): UseOnHandQuantityType => {
  const { workspaceState } = FB.useStores();

  const transfers = useObserver(() => workspaceState?.formInputSync.get(TRANSFERS_FIELD) as LotTransfer[]);
  const initialQuantity = useObserver(() => workspaceState?.formInputSync.get(INITIAL_QUANTITY_FIELD) as number);
  const onHandQuantityUnit = useObserver(() => workspaceState?.formInputSync.get(`${INITIAL_QUANTITY_FIELD}_unit`) as string);

  const onHandQuantity = transfers?.reduce(
    (sum, transfer) => calculateSumForTransfer(transfer, sum),
    initialQuantity ?? 0,
  ) ?? initialQuantity;

  const onHandQuantityFiltered
    = skipTransfer
      ? transfers?.reduce(
        (sum, transfer) => skipTransfer === transfer.id ? sum : calculateSumForTransfer(transfer, sum),
        initialQuantity,
      ) ?? initialQuantity
      : onHandQuantity;

  return {
    initialQuantity,
    onHandQuantity,
    onHandQuantityUnit,
    onHandQuantityFiltered,
  };
};
