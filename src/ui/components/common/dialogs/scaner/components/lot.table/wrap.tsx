import { differenceBy, orderBy, unionBy } from 'lodash';
import { useState } from 'react';
import { FB } from '../../../../../../form.builder';
import { FBScanLotProps, ScanLot } from './types';

const prepareData = (list: ScanLot[] = []) => orderBy(list, 'primary', 'desc');

export const withFBScanLot = <T extends FBScanLotProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const [vendors, setVendors] = useState<ScanLot[]>(prepareData(workspaceState?.formInputSync.get(name) ?? []));

    const updateState = (state: ScanLot[]) => {
      setVendors(prepareData(state));
      formState?.setFieldValue(name, state);
      formState?.setFieldAutosave(name);
    };

    const prepareVendor = (vendor: ScanLot): ScanLot => ({
      ...vendor,
    });

    const deleteVendor = (item: ScanLot, updatedPrimaryVendorId?: string) => {
      const fiteredVendors = differenceBy(vendors, [item], 'id');
      const updatedVendors
        = updatedPrimaryVendorId
          ? updatePrimaryVendor(updatedPrimaryVendorId, fiteredVendors)
          : fiteredVendors;
      updateState(updatedVendors);
    };

    const updateVendor = (item: ScanLot) => {
      const updatedVendors = unionBy([prepareVendor(item)], vendors, 'id');
      updateState(updatedVendors);
    };

    const updatePrimaryVendor = (id: string, vendors: ScanLot[]) => vendors.map(item => ({
      ...item,
      primary: item.id === id,
    }));

    return Component({
      ...props as T,
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      vendors,
      updateVendor,
      deleteVendor,
    });
  };

  return (props: T) => Comp(props);
};
