import { useObserver } from 'mobx-react';
import { FB } from '..';
import { isDocumentRevisionInDraft } from '../../documentRevision/helpers/documentRevisionStatus';
import { SHIPPING_CUSTOMER_FIELD } from '../FBShippingInfo/constants';
import { FBShippingMethodProps } from './types';

export const withFBShippingMethod = <T extends FBShippingMethodProps>(Component: React.FC<T>): React.FC<T> => {
  const Comp = (props: T) => {
    const { workspaceState, formState } = FB.useStores();
    const isDocumentIsInDraft = isDocumentRevisionInDraft(workspaceState?.document?.status);

    const customerId = useObserver(
      () =>
        isDocumentIsInDraft ? formState?.getFieldValue(SHIPPING_CUSTOMER_FIELD) : formState?.getFieldValue(SHIPPING_CUSTOMER_FIELD)
        || workspaceState?.formInputSync.get(SHIPPING_CUSTOMER_FIELD)
        || workspaceState?.formInput?.customer,
    );

    console.log('isDocumentIsInDraft', customerId);

    return Component({
      ...props,
      customerId,
    });
  };

  return (props: T) => Comp(props);
};
