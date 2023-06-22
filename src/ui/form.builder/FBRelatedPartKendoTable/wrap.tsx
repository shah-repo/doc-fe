import { useState } from 'react';
import { VendorData, VendorDataProps } from './types';
import { getVendorData } from './utils';

export const withFBVendorData = <T extends VendorDataProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    ...props
  }: T) => {
    const [items, setItems] = useState<VendorData[]>(getVendorData());

    const addVendorData = (item: VendorData) => {
      setItems([...items, item]);
    };

    return Component({
      ...props as T,
      name,
      items,
      addVendorData,
    });
  };

  return (props: T) => Comp(props);
};
