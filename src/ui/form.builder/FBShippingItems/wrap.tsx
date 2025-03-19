import { differenceBy, unionBy } from 'lodash';
import { useState } from 'react';
import { FB } from '..';
import { FBShippingItemsProps, ShippingItem } from './types';
import { useOptions } from './utils';

export const withFBShippingItems = <T extends FBShippingItemsProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const [shippingItems, setShippingItems] = useState<ShippingItem[]>(workspaceState?.formInputSync.get(name) ?? []);
    const { parts, lots, fetchLotsByPartId, isLotsloading, isPartsloading } = useOptions();

    const updateState = (state: ShippingItem[]) => {
      setShippingItems(state);
      formState?.setFieldValue(name, state);
      formState?.setFieldAutosave(name);
    };

    const updateShippingItem = (item: ShippingItem) => {
      const normalizedItem = {
        ...item,
        quantity: typeof item.quantity === 'number' ? item.quantity : undefined,
      };

      const newItems = unionBy([normalizedItem], shippingItems, 'id');
      updateState(newItems);
    };

    const deleteShippingItem = (item: ShippingItem) => {
      const updatedItems = differenceBy(shippingItems, [item], 'id');
      updateState(updatedItems);
    };

    return Component({
      ...props as T,
      name,
      lots,
      parts,
      isLotsloading,
      isPartsloading,
      disabled: disabled ?? workspaceState?.isPreview,
      shippingItems,
      fetchLotsByPartId,
      updateShippingItem,
      deleteShippingItem,
    });
  };

  return (props: T) => Comp(props);
};
