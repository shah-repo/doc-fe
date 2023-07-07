import { round, unionBy } from 'lodash';
import { useObserver } from 'mobx-react';
import { FB } from '..';
import { DEDUCTABLE_TRANSFER_TYPES, INCREMENTABLE_LOT_TRANSFER_TYPES, INITIAL_QUANTITY_FIELD, MAX_DECIMALS, TRANSFERS_FIELD } from './constants';
import { CalculableLotTransfer, DocumentRevisionOption, LotTransfer, PredictQuantityFunction } from './types';

export const getOptionLabel = (option: DocumentRevisionOption) => {
  const baseLabel = `${option.document?.docId} - rev ${option.displayRevision}`;
  return option.name ? `${baseLabel} - ${option.name}` : baseLabel;
};

interface UseOnHandQuantityType {
  initialQuantity: number
  onHandQuantity: number
  onHandQuantityUnit: string
  predictOnHandQuantity: PredictQuantityFunction
}

const calculateSumForTransfer = (transfer: CalculableLotTransfer, sum: number) => {
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

export const useOnHandQuantity = (): UseOnHandQuantityType => {
  const { workspaceState } = FB.useStores();

  const transfers = useObserver(() => {
    const value = workspaceState?.formInputSync.get(TRANSFERS_FIELD) as LotTransfer[] | undefined;
    return value ?? [];
  });
  const initialQuantity = useObserver(() => {
    const value = workspaceState?.formInputSync.get(INITIAL_QUANTITY_FIELD) as number | null;
    return value ?? 0;
  });
  const onHandQuantityUnit = useObserver(() => {
    const value = workspaceState?.formInputSync.get(`${INITIAL_QUANTITY_FIELD}_unit`) as string;
    return value ?? '';
  });

  const onHandQuantity = transfers.reduce(
    (sum, transfer) => calculateSumForTransfer(transfer, sum),
    initialQuantity,
  );

  const predictOnHandQuantity: PredictQuantityFunction = ({ skipTransfer, newTransfer }) => {
    const filteredTransfers = transfers.filter((transfer) => transfer.id !== skipTransfer?.id) ?? [];
    const allTransfers = newTransfer ? unionBy([newTransfer], filteredTransfers) : filteredTransfers;

    return allTransfers.reduce(
      (sum, transfer) => calculateSumForTransfer(transfer, sum),
      initialQuantity,
    );
  };

  return {
    initialQuantity,
    onHandQuantity,
    onHandQuantityUnit,
    predictOnHandQuantity,
  };
};
