import { differenceBy, orderBy, unionBy } from 'lodash';
import { useState } from 'react';
import { FB } from '..';
import { DEFAULT_CURRENCY } from './constants';
import { FBPartVendorsProps, InputData, Vendor } from './types';
import { useOptions } from './utils';

const prepareList = (list: Vendor[] = []) => orderBy(list, 'primary', 'desc');

const prepareData = (data: InputData = { list: [] }) => ({
  ...data,
  list: prepareList(data.list),
});

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
    const [data, setData] = useState<InputData>(prepareData(workspaceState?.formInputSync.get(name) ?? { list: [] }));

    const setStandardCost = (value: number) => {
      updateState({ standardCost: { value, currency: DEFAULT_CURRENCY } });
    };

    const setStandardLeadTime = (value: number) => {
      updateState({ standardLeadTime: value });
    };

    const updateState = (state: InputData) => {
      const newData = {
        ...data,
        ...state,
      };
      setData(prepareData(newData));
      formState?.setFieldValue(name, newData);
      formState?.setFieldAutosave(name);
    };

    const deleteVendor = (item: Vendor) => {
      const list = differenceBy(data.list, [item], 'id');
      updateState({ list });
    };

    const updateVendor = (item: Vendor) => {
      const list = unionBy([item], data.list, 'id');
      updateState({ list });
    };

    const setPrimaryVendor = (id: string) => {
      const list = data.list?.map((item) => ({
        ...item,
        primary: item.id === id,
      }));
      updateState({ list });
    };

    return Component({
      ...props as T,
      ...data,
      name,
      disabled,
      units,
      statuses,
      suppliers,
      updateVendor,
      deleteVendor,
      setPrimaryVendor,
      setStandardCost,
      setStandardLeadTime,
    });
  };

  return (props: T) => Comp(props);
};
