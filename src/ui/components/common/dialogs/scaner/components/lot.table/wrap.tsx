import { FB } from '../../../../../../form.builder';
import { ScanLot, ScanLotTableProps } from './types';

export const withFBScanLot = <T extends ScanLotTableProps>(Component: React.FC<T>): React.FC<T> => {
  const Comp = ({ disabled, partId, setScanLots, scanLots, ...props }: T) => {
    const { workspaceState } = FB.useStores();

    const deleteScanLot = (item: ScanLot) => {
      if (!item.id) return;

      const filteredScanLots = scanLots?.filter(lot => lot.id !== item.id);
      setScanLots(filteredScanLots);
    };

    const updateScanLot = (item: ScanLot) => {
      const updatedLots = scanLots.some((lot) => lot.id === item.id)
        ? scanLots.map((lot) => (lot.id === item.id ? item : lot))
        : [...scanLots, item];

      setScanLots(updatedLots);
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
