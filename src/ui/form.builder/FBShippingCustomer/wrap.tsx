import { useObserver } from 'mobx-react';
import { useEffect, useState } from 'react';
import { FB, FBAutocompleteAsyncOption } from '..';
import { allocationActions } from '../../../state/ducks/Allocation';
import { toastError } from '../../components/notifications';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { SHIPPING_ADDRESS_FIELDS } from './constants';
import { CustomerRevisionInfo, FBShippingCustomerProps } from './types';

export const withFBShippingCustomer = <T extends FBShippingCustomerProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = (props: T) => {
    const { name } = props;
    const { workspaceState, formState } = FB.useStores();
    const [latestRevisionSummary, setLatestRevisionSummary] = useState<CustomerRevisionInfo>();
    const customerId = useObserver(
      () =>
        formState?.getFieldValue(name)
        || workspaceState?.formInputSync.get(name)
        || workspaceState?.formInput?.shippingCustomer,
    );

    const [autocompleteKey, setAutocompleteKey] = useState<string | undefined>(customerId);

    const fetchLatestRevisionSummary = useActionCreator(
      allocationActions.fetchLatestRevisionDetailsByRevId,
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
    }, [customerId]);

    useEffect(() => {
      if (FB.isUUID(customerId)) {
        setAutocompleteKey(customerId);
      }
    }, [customerId]);

    const clearAddressFields = () => {
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
      FBAutocompleteAsyncStore.reset(FBAutocompleteAsyncOption.shippingInformation);
      setLatestRevisionSummary(undefined);
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
    });
  };

  return (props: T) => Comp(props);
};
