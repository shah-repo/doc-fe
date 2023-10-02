import { differenceBy, isNumber, orderBy, unionBy } from 'lodash';
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
    const [vendors, setVendors] = useState<Vendor[]>(prepareData(workspaceState?.formInputSync.get(name) ?? []));
    const { suppliers, units, statuses } = useOptions(vendors.map(v => v.vendor));

    const updateState = (state: Vendor[]) => {
      setVendors(prepareData(state));
      formState?.setFieldValue(name, state);
      formState?.setFieldAutosave(name);
    };

    const prepareVendor = (vendor: Vendor): Vendor => ({
      ...vendor,
      cost: vendor.cost?.value ? {
        ...vendor.cost,
        currency: DEFAULT_CURRENCY,
      } : undefined,
      leadTime: isNumber(vendor.leadTime) ? vendor.leadTime : undefined,
      conversion: isNumber(vendor.conversion) ? vendor.conversion : undefined,
      vendor: {
        name: vendor.vendor.name,
        id: vendor.vendor.id,
      },
    });

    const deleteVendor = (item: Vendor) => {
      const updatedVendors = differenceBy(vendors, [item], 'id');
      updateState(updatedVendors);
    };

    const updateVendor = (item: Vendor) => {
      const newVendors = unionBy([prepareVendor(item)], vendors, 'id');
      const updatedVendors = item.primary ? updatePrimaryVendor(item.id, newVendors) : newVendors;
      updateState(updatedVendors);
    };

    const updatePrimaryVendor = (id: string, vendors: Vendor[]) => vendors.map(item => ({
      ...item,
      primary: item.id === id,
    }));

    const setPrimaryVendor = (id: string) => {
      const updatedVendors = updatePrimaryVendor(id, vendors);
      updateState(updatedVendors);
    };

    return Component({
      ...props as T,
      name,
      disabled: disabled ?? workspaceState?.isPreview,
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
