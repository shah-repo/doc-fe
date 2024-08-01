import { round, unionBy } from 'lodash';
import { useObserver } from 'mobx-react';
import { useSelector } from 'react-redux';
import { FB } from '..';
import { authSelectors } from '../../../state/ducks/auth';
import { Group } from '../../../state/ducks/auth/types';
import { companySelectors } from '../../../state/ducks/company';
import { materialFlowACLSelectors } from '../../../state/ducks/materialFlowAcl';
import { MaterialFlowAclRule } from '../../../state/ducks/materialFlowAcl/types';
import { DEDUCTABLE_TRANSFER_TYPES, INCREMENTABLE_LOT_TRANSFER_TYPES, INITIAL_QUANTITY_FIELD, MAX_DECIMALS, TRANSFERS_FIELD } from './constants';
import { AllowedOptions, CalculableLotTransfer, CompanyLocation, DocumentRevisionOption, LotTransfer, LotTransferType, PredictQuantityFunction, SelectedOptions } from './types';

export const getOptionLabel = (option: DocumentRevisionOption): string => {
  const baseLabel = `${option.document?.docId} - rev ${option.displayRevision}`;
  return option.name ? `${baseLabel} - ${option.name}` : baseLabel;
};

interface UseOnHandQuantityType {
  initialQuantity: number
  onHandQuantity: number
  onHandQuantityUnit: string
  predictOnHandQuantity: PredictQuantityFunction
}

export const shapeQuantity = (quantity: number, type: LotTransferType): number => {
  return [LotTransferType.Backflush].includes(type) ? quantity : Math.abs(quantity);
};

const calculateSumForTransfer = (transfer: CalculableLotTransfer, sum: number) => {
  const shouldDeduct = DEDUCTABLE_TRANSFER_TYPES.includes(transfer.type);
  const shouldAdd = INCREMENTABLE_LOT_TRANSFER_TYPES.includes(transfer.type);
  let result = sum;
  if (shouldDeduct) {
    result -= shapeQuantity(transfer.quantity, transfer.type);
  }
  if (shouldAdd) {
    result += shapeQuantity(transfer.quantity, transfer.type);
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

const getAllowedTransferOptions = (
  rules: MaterialFlowAclRule[],
  locations: CompanyLocation[],
  groups: Group[],
  selectedOptions: SelectedOptions = {},
) => {
  const allowedActions = new Set<string>();
  const allowedFromLocations = new Set<string>();
  const allowedToLocations = new Set<string>();

  rules.forEach(rule => {
    const isGroupMatched = rule.groups.some(group => groups.some(it => it.id === group.id));
    if (isGroupMatched) {
      if (selectedOptions.type && rule.action !== selectedOptions.type) return;
      if (selectedOptions.from && rule.from !== selectedOptions.from) return;
      if (selectedOptions.to && rule.to !== selectedOptions.to) return;

      allowedActions.add(rule.action);
      allowedFromLocations.add(rule.from);
      if (rule.to) {
        allowedToLocations.add(rule.to);
      } else {
        locations.forEach((option) => {
          allowedToLocations.add(option.id);
        });
      }
    }
  });

  return {
    type: Array.from(allowedActions),
    from: Array.from(allowedFromLocations),
    to: Array.from(allowedToLocations),
  };
};

export const useAllowedLotTransferOptions = (
  selectedOptions: SelectedOptions = {},
): [boolean, AllowedOptions] => {
  const locations = useSelector(companySelectors.getAllLocations) ?? [];
  const rules = useSelector(materialFlowACLSelectors.getRules) ?? [];
  const userGroups = useSelector(authSelectors.currentUserGroups) ?? [];
  const isAclEnabled = rules.length > 0;

  if (!isAclEnabled) {
    return [false, { type: [], from: [], to: [] }];
  }

  return [true, getAllowedTransferOptions(rules, locations, userGroups, selectedOptions)];
};
