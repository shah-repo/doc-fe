import { useObserver } from 'mobx-react';
import { useState } from 'react';
import { FB } from '..';
import { isDocumentRevisionInDraft } from '../../documentRevision/helpers/documentRevisionStatus';
import { SHIPPING_CUSTOMER_FIELD } from '../FBShippingInfo/constants';
import { FBShippingMethodProps } from './types';

export const withFBShippingMethod = <T extends FBShippingMethodProps>(Component: React.FC<T>): React.FC<T> => {
  const Comp = (props: T) => {
    const { workspaceState, formState } = FB.useStores();
    const isDraft = isDocumentRevisionInDraft(workspaceState?.document?.status);

    let customerId = useObserver(
      () =>
        formState?.getFieldValue(SHIPPING_CUSTOMER_FIELD)
        || workspaceState?.formInputSync.get(SHIPPING_CUSTOMER_FIELD)
        || workspaceState?.formInput?.customer,
    );

    customerId = isDraft ? formState?.getFieldValue(SHIPPING_CUSTOMER_FIELD) : customerId;
    const [selectKey, setSelectKey] = useState<string | undefined>(customerId);

    useObserver(() => {
      const selectedCustomer = workspaceState?.formInputSync?.get(SHIPPING_CUSTOMER_FIELD);
      if (selectedCustomer !== selectKey) {
        setSelectKey(selectedCustomer);
      }
      console.log('selectedCustomer in Shipping method', selectKey);
    });

    return Component({
      ...props,
      selectKey,
    });
  };

  return (props: T) => Comp(props);
};
