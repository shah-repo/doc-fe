import { useEffect, useState } from 'react';
import { FB } from '..';
import { FBShippingItemsProps, ShippingItem } from './types';

export const withFBShippingItems = <T extends FBShippingItemsProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const { workspaceState } = FB.useStores();
    const [shippingItems, setShippingItems] = useState<ShippingItem[]>();

    useEffect(() => {
      if (!workspaceState?.documentId && !workspaceState?.formInputSync.get(name)) {

      }
    }, [workspaceState?.documentId, workspaceState?.formInput?.[name]]);

    return Component({
      ...props as T,
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      shippingItems,
      setShippingItems,
    });
  };

  return (props: T) => Comp(props);
};
