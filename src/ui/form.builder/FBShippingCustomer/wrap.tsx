/* eslint-disable @typescript-eslint/no-unused-vars */
import { isEmpty } from 'lodash';
import { useObserver } from 'mobx-react';
import { FB } from '..';
import { SHIPPING_CUSTOMER_FIELD } from './constants';
import { FBShippingCustomerProps } from './types';

export const withFBShippingCustomer = <T extends FBShippingCustomerProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled = false,
    ...props
  }: T) => {
    const { workspaceState, formState } = FB.useStores();
    const defaultValue = formState?.getFieldValue(name) ?? '';
    const customerId = useObserver(() => formState?.getFieldValue(SHIPPING_CUSTOMER_FIELD) || workspaceState?.formInputSync.get(SHIPPING_CUSTOMER_FIELD) || workspaceState?.formInput?.customer);
    const isCustomerFieldEmpty = isEmpty(formState?.getFieldValue(SHIPPING_CUSTOMER_FIELD));
    console.log('customerId', customerId, isCustomerFieldEmpty, defaultValue);
    return Component({
      ...props as T,
    });
  };

  return (props: T) => Comp(props);
};
