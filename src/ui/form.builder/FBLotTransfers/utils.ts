import { round, unionBy } from 'lodash';
import { useObserver } from 'mobx-react';
import { FB } from '..';
import { DEDUCTABLE_TRANSFER_TYPES, INCREMENTABLE_LOT_TRANSFER_TYPES, INITIAL_QUANTITY_FIELD, MAX_DECIMALS, TRANSFERS_FIELD } from './constants';
import { LotTransfer, PredictFunction } from './types';

interface UseOnHandQuantityType {
  initialQuantity: number
  onHandQuantity: number
  onHandQuantityUnit: string
  predictOnHandQuantity: PredictFunction
}

const calculateSumForTransfer = (transfer: LotTransfer, sum: number) => {
  const shouldDeduct = DEDUCTABLE_TRANSFER_TYPES.includes(transfer.type);
  const shouldAdd = INCREMENTABLE_LOT_TRANSFER_TYPES.includes(transfer.type);
  let result = sum;
  if (shouldDeduct) {
    result -= Math.abs(transfer.quantity);
  }
  if (shouldAdd) {
    result += Math.abs(transfer.quantity);
  }
  return round(result, MAX_DECIMALS);
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
    const filteredTransfers = transfers?.filter((transfer) => transfer.id !== skipTransfer?.id);
    const allTransfers = newTransfer ? unionBy([newTransfer], filteredTransfers) : filteredTransfers;

    return allTransfers?.reduce(
      (sum, transfer) => calculateSumForTransfer(transfer, sum),
      initialQuantity ?? 0,
    ) ?? initialQuantity;
  };

  return {
    initialQuantity,
    onHandQuantity,
    onHandQuantityUnit,
    predictOnHandQuantity,
  };
};
