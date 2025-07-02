import { differenceBy, orderBy, unionBy } from 'lodash';
import { useState } from 'react';
import { FB } from '../../../../../../form.builder';
import { ScanLot, ScanLotTableProps } from './types';
import { useOptions } from './utils';

const prepareData = (list: ScanLot[] = []) => orderBy(list, 'primary', 'desc');

export const withFBScanLot = <T extends ScanLotTableProps>(Component: React.FC<T>): React.FC<T> => {
  const Comp = ({ disabled, partId, ...props }: T) => {
    const { workspaceState } = FB.useStores();
    const [scanLots, setScanLots] = useState<ScanLot[]>([]);
    const partId1 = '1d0e10d6-8b1d-4ea6-a6e8-a00ae30852c6';
    console.log('partId :', partId);
    const { units, lots } = useOptions(partId ?? partId1);

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
      units,
      lots,
      updateScanLot,
      deleteScanLot,
    });
  };

  return (props: T) => Comp(props);
};
