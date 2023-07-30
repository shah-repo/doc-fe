import { differenceBy, orderBy, unionBy } from 'lodash';
import { useState } from 'react';
import { FB } from '..';
import { DEFAULT_CURRENCY } from './constants';
import { FBPartVendorsProps, Vendor } from './types';
import { useOptions } from './utils';

const prepareData = (list: Vendor[] = []) => orderBy(list, 'primary', 'desc');

export const withFBPartVendors = <T extends FBPartVendorsProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const { suppliers, units, statuses } = useOptions();
    const [vendors, setVendors] = useState<Vendor[]>(prepareData(workspaceState?.formInputSync.get(name) ?? []));

    const updateState = (state: Vendor[]) => {
      setVendors(prepareData(state));
      formState?.setFieldValue(name, state);
      formState?.setFieldAutosave(name);
    };

    const prepareVendor = (vendor: Vendor) => ({
      ...vendor,
      ...(vendor.cost?.value && ({
        unitCost: {
          ...vendor.cost,
          currency: DEFAULT_CURRENCY,
        },
      })),
    });

    const deleteVendor = (item: Vendor) => {
      const updatedVendors = differenceBy(vendors, [item], 'id');
      updateState(updatedVendors);
    };

    const updateVendor = (item: Vendor) => {
      const updatedVendors = unionBy([prepareVendor(item)], vendors, 'id');
      updateState(updatedVendors);
    };

    const setPrimaryVendor = (id: string) => {
      const updatedVendors = vendors.map((item) => ({
        ...item,
        primary: item.id === id,
      }));
      updateState(updatedVendors);
    };

    return Component({
      ...props as T,
      name,
      disabled,
      units,
      vendors,
      statuses,
      suppliers,
      updateVendor,
      deleteVendor,
      setPrimaryVendor,
    });
  };

  return (props: T) => Comp(props);
};
