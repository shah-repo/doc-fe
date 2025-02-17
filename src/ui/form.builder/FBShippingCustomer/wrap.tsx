import { useObserver } from 'mobx-react';
import { useEffect, useState } from 'react';
import { FB } from '..';
import { ShippingActions } from '../../../state/ducks/Shipping';
import { toastError } from '../../components/notifications';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { SHIPPING_ADDRESS_FIELDS } from './constants';
import { CustomerRevisionInfo, FBShippingCustomerProps } from './types';

export const withFBShippingCustomer = <T extends FBShippingCustomerProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = (props: T) => {
    const { name } = props;
    const { workspaceState, formState } = FB.useStores();
    const [latestRevisionSummary, setLatestRevisionSummary]
      = useState<CustomerRevisionInfo>();
    const customerId = useObserver(
      () =>
        formState?.getFieldValue(name)
        || workspaceState?.formInputSync.get(name)
        || workspaceState?.formInput?.shippingCustomer,
    );

    const [autocompleteKey, setAutocompleteKey]
      = useState<string | undefined>(customerId);

    const fetchLatestRevisionSummary = useActionCreator(
      ShippingActions.fetchLatestRevisionDetailsByRevId,
    );
    const latestRevisionSummaryAsync = useAsync<CustomerRevisionInfo>({
      onSuccess: (data) => {
        setLatestRevisionSummary(data);
      },
      onError: toastError,
    });

    useEffect(() => {
      if (!FB.isUUID(customerId)) {
        return;
      }

      latestRevisionSummaryAsync.start(
        fetchLatestRevisionSummary,
        customerId,
        latestRevisionSummaryAsync,
      );
    }, []);

    useEffect(() => {
      if (FB.isUUID(customerId)) {
        setAutocompleteKey(customerId);
      }
    }, [customerId]);

    const clearAddressFields = () => {
      // TODO handle Once API Done
      formState?.setFieldValue(SHIPPING_ADDRESS_FIELDS.ADDRESS, {});
      formState?.setFieldValue(SHIPPING_ADDRESS_FIELDS.ATTENTION, {});
      formState?.setFieldValue(SHIPPING_ADDRESS_FIELDS.CONTACT, {});
      workspaceState?.saveDocRev(formState?.getValues());
    };

    const updateLatestAvailableRevision = () => {
      const newCustomerId = latestRevisionSummary?.revisionDetails.id;
      formState?.setFieldValue(name, newCustomerId);
      setAutocompleteKey(newCustomerId);
      clearAddressFields();
    };

    const resetOBSCustomerSelection = () => {
      formState?.setFieldValue(name, '');
      setAutocompleteKey('');
      clearAddressFields();
    };

    return Component({
      ...props,
      updateLatestAvailableRevision,
      latestRevisionSummary: latestRevisionSummary,
      resetOBSCustomerSelection,
      autocompleteKey: autocompleteKey,
      defaultValue: { value: customerId },
    });
  };

  return (props: T) => Comp(props);
};
