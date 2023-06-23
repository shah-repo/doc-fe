import { useObserver } from 'mobx-react';
import { FB } from '..';
import { DEDUCTABLE_TRANSFER_TYPES, INITIAL_QUANTITY_FIELD, TRANSFERS_FIELD } from './constants';
import { LotTransfer, LotTransferType, PredictFunction } from './types';

interface UseOnHandQuantityType {
  initialQuantity: number
  onHandQuantity: number
  onHandQuantityUnit: string
  predictOnHandQuantity: PredictFunction
}

const calculateSumForTransfer = (transfer: LotTransfer, sum: number) => {
  const shouldDeduct = DEDUCTABLE_TRANSFER_TYPES.includes(transfer.type);
  const shouldAdd = transfer.type !== LotTransferType.Move;
  if (shouldDeduct) {
    return sum - Math.abs(transfer.quantity);
  }
  if (shouldAdd) {
    return sum + Math.abs(transfer.quantity);
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

  const predictOnHandQuantity: PredictFunction = ({ skipTransfer, newTransfer }) => {
    if (!transfers?.length) {
      return initialQuantity ?? 0;
    }
    const allTransfers = newTransfer ? [...transfers, newTransfer] : transfers;

    return allTransfers?.reduce(
      (sum, transfer) => skipTransfer?.id === transfer.id ? sum : calculateSumForTransfer(transfer, sum),
      initialQuantity,
    ) ?? initialQuantity;
  };

  return {
    initialQuantity,
    onHandQuantity,
    onHandQuantityUnit,
    predictOnHandQuantity,
  };
};
