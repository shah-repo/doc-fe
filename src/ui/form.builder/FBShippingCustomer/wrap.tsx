import { debounce, isEmpty } from 'lodash';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import { useEffect, useRef, useState } from 'react';
import { FB, FBAutocompleteAsyncOption, FBAutocompleteAsyncState } from '..';
import { allocationActions } from '../../../state/ducks/Allocation';
import { toastError } from '../../components/notifications';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { SHIPPING_METHOD_FIELD } from '../FBShippingMethod/constants';
import { SHIPPING_ADDRESS_FIELDS } from './constants';
import { CustomerRevisionInfo, FBShippingCustomerProps } from './types';

export const withFBShippingCustomer = <T extends FBShippingCustomerProps>(Component: React.FC<T>): React.FC<T> => {
  const Comp = (props: T) => {
    const { name } = props;
    const { workspaceState, formState } = FB.useStores();
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const previousCustomerIdRef = useRef<string>('');
    const debouncedSaveDocRevRef = useRef<ReturnType<typeof debounce> | null>(null);
    const [latestRevisionSummary, setLatestRevisionSummary] = useState<CustomerRevisionInfo>();
    const customerId = useObserver(
      () =>
        formState?.getFieldValue(name)
        || workspaceState?.formInputSync.get(name)
        || workspaceState?.formInput?.shippingCustomer,
    );

    const [autocompleteKey, setAutocompleteKey] = useState<string | undefined>(customerId);

    const fetchLatestRevisionSummary = useActionCreator(allocationActions.fetchLatestRevisionDetailsByRevId);
    const latestRevisionSummaryAsync = useAsync<CustomerRevisionInfo>({
      onSuccess: (data) => {
        setLatestRevisionSummary(data);
      },
      onError: toastError,
    });

    const customersAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
      optionId: FBAutocompleteAsyncOption.shippingInformation,
    });

    useEffect(() => {
      customersAsync.load();
    }, [customersAsync]);

    useEffect(() => {
      const updateCustomerShippingMethod = (customerId: string, shippingMethod: string) => {
        const updateCustomerShippingMethod = () => {
          if (!workspaceState?.loading) {
            workspaceState?.saveDocRev(formState?.getValues());
            previousCustomerIdRef.current = customerId;
            formState?.setFieldValue(SHIPPING_METHOD_FIELD, shippingMethod);
            formState?.getInputState(SHIPPING_METHOD_FIELD)?.setRender();
          } else {
            debounceTimerRef.current = setTimeout(updateCustomerShippingMethod, 100);
          }
        };
        updateCustomerShippingMethod();
      };

      debouncedSaveDocRevRef.current = debounce(updateCustomerShippingMethod, 100, { leading: false, trailing: true });

      const disposer = reaction(
        () => customersAsync.autocompleteValueApi.data,
        (data) => {
          if (!data) return;

          const currentCustomerId = data.id;
          if (currentCustomerId === previousCustomerIdRef.current) return;

          const shippingMethod = data?.formInput?.shippingMethod;
          formState?.setFieldValue(SHIPPING_METHOD_FIELD, shippingMethod);

          debouncedSaveDocRevRef.current?.(currentCustomerId, shippingMethod);
        },
      );

      return () => {
        debouncedSaveDocRevRef.current?.cancel();
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        disposer();
      };
    }, []);

    const onShippingCustomerChange = debounce(
      () => {
        const selectedCustomerId = formState?.getFieldValue(name);

        if (isEmpty(selectedCustomerId)) {
          formState?.setFieldValue(SHIPPING_METHOD_FIELD, '', true);
          formState?.getInputState(SHIPPING_METHOD_FIELD)?.setRender();
        } else {
          customersAsync.fetchAutocompleteOption(selectedCustomerId, FBAutocompleteAsyncOption.shippingInformation);
        }
      },
      100,
      { leading: false, trailing: true },
    );

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
      onShippingCustomerChange,
    });
  };

  return (props: T) => Comp(props);
};
