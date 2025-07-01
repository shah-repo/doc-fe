import { differenceBy, orderBy, unionBy } from 'lodash';
import { useState } from 'react';
import { FB } from '../../../../../../form.builder';
import { ScanLot, ScanLotTableProps } from './types';

const prepareData = (list: ScanLot[] = []) => orderBy(list, 'primary', 'desc');

export const withFBScanLot = <T extends ScanLotTableProps>(Component: React.FC<T>): React.FC<T> => {
  const Comp = ({ disabled, ...props }: T) => {
    const { workspaceState } = FB.useStores();
    const [scanLots, setScanLots] = useState<ScanLot[]>([]);

    const updateState = (state: ScanLot[]) => {
      setScanLots(prepareData(state));
    };

    const deleteScanLot = (item: ScanLot) => {
      const filteredScanLots = differenceBy(scanLots, [item], 'id');
      updateState(filteredScanLots);
    };

    const updateScanLot = (item: ScanLot) => {
      const updatedVendors = unionBy(
        [
          {
            ...item,
          },
        ],
        scanLots,
        'id',
      );
      updateState(updatedVendors);
    };

    return Component({
      ...(props as T),
      disabled: disabled ?? workspaceState?.isPreview,
      scanLots,
      updateScanLot,
      deleteScanLot,
    });
  };

  return (props: T) => Comp(props);
};
