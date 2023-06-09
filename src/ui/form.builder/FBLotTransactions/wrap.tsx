import { useState } from 'react';
import { useSelector } from 'react-redux';
import { companySelectors } from '../../../state/ducks/company';
import { FBLotTransactionsProps, LotTransfer } from './types';
import { getLocations, getLotTransactions } from './utils';

export const withFBLotTransactions = <T extends FBLotTransactionsProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    ...props
  }: T) => {
    const [transactions, setTransactions] = useState<LotTransfer[]>(getLotTransactions());
    const locations = getLocations();
    const employees = useSelector(companySelectors.getAllEmployees) ?? [];

    const addLotTransaction = (transaction: LotTransfer) => {
      setTransactions([...transactions, transaction]);
    };

    return Component({
      ...props as T,
      name,
      locations,
      employees,
      transactions,
      addLotTransaction,
    });
  };

  return (props: T) => Comp(props);
};
