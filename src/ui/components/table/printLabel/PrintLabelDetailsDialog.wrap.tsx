import React from 'react';
import { useSelector } from 'react-redux';
import { PrintLabelDetailsDialogProps } from '..';
import { companySelectors } from '../../../../state/ducks/company';

export const withPrintLabelDetailsDialog = <T extends PrintLabelDetailsDialogProps>(
  Component: React.FunctionComponent<T>,
	) => {
	const Comp = ({
    isOpen = false,
    ...props
  }: T) => {
  const companyEmployes = useSelector(companySelectors.getActiveEmployees);
  console.log('--companyEmployes--', { companyEmployes });
	return Component({
		...(props as T),
		isOpen,
	});
};

return (props: T) => Comp(props);
	};
