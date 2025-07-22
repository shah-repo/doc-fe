import { differenceBy, unionBy } from 'lodash';
import { useObserver } from 'mobx-react';
import { FB, FBAutocompleteAsyncOption } from '../../../../../../form.builder';
import FBAutocompleteAsyncStore from '../../../../../../form.builder/FBAutocompleteAsync/FBAutocompleteAsync.store';
import { ScanLot, ScanLotTableProps, UnitOption } from './types';

export const withFBScanLot = <T extends ScanLotTableProps>(Component: React.FC<T>): React.FC<T> => {
  const Comp = ({ disabled, partId, setScanLots, scanLots, ...props }: T) => {
    const { workspaceState } = FB.useStores();

    const units = useObserver(() => {
      const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.unitMeasures) as Map<
      string,
      UnitOption
      >;
      return asyncData ? Array.from(asyncData.values()).map((item) => item.text) : [];
    });

    const updateState = (state: ScanLot[]) => {
      setScanLots(state);
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
      updateScanLot,
      deleteScanLot,
    });
  };

  return (props: T) => Comp(props);
};
