import { differenceBy, orderBy, unionBy } from 'lodash';
import { useState } from 'react';
import { FB } from '..';
import { FBProductORServiceProps, ProductORService } from './types';

const prepareData = (list: ProductORService[] = []) => orderBy(list, 'primary', 'desc');

const demoItems = [
  {
    itemId: 'ABC',
    lifecyclePhase: 'DEVELOPMENT',
    status: 'APPROVED',
    supplierPartNumber: '1530013213RPB87',
    comment: 'Hello world',
  },
];
export const withFBProductORService = <T extends FBProductORServiceProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const [items, setItems] = useState<ProductORService[]>(prepareData(workspaceState?.formInputSync.get(name) ?? demoItems));

    const updateState = (state: ProductORService[]) => {
      setItems(prepareData(state));
      formState?.setFieldValue(name, state);
      formState?.setFieldAutosave(name);
    };

    const deleteItem = (item: ProductORService) => {
      const filteredItems = differenceBy(items, [item], 'id');
      updateState(filteredItems);
    };

    const updateItem = (item: ProductORService) => {
      const newItem = unionBy([item], items, 'id');
      updateState(newItem);
    };

    return Component({
      ...props as T,
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      items,
      deleteItem,
      updateItem,
    });
  };

  return (props: T) => Comp(props);
};
