import { isEmpty } from 'lodash';
import { useObserver } from 'mobx-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { FB, FBAutocompleteAsyncOption } from '..';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { shippingInfoActions } from '../../../state/ducks/ShippingInformation';
import { toastError } from '../../components/notifications';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { ContactValue, CustomOptionType, FBShippingAddressProps, ShippingAddress } from './types';

export const withFBShippingAddress = <T extends FBShippingAddressProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled = false,
    ...props
  }: T) => {
    const { workspaceState, formState } = FB.useStores();
    const [options, setOptions] = useState<CustomOptionType[]>([]);
    const defaultValue = formState?.getFieldValue(name) ?? '';
    const shippingAddress = useObserver(() => formState?.getFieldValue('shipping_address') || workspaceState?.formInputSync.get('shipping_address') || workspaceState?.formInput?.shipping_address);
    const customerId = useObserver(() => formState?.getFieldValue('customer') || workspaceState?.formInputSync.get('customer') || workspaceState?.formInput?.customer);
    const isCustomerFieldLoading = useObserver(() => workspaceState?.documentRevApi.loading);
    const isCustomerFieldEmpty = isEmpty(formState?.getFieldValue('customer'));
    const isShippingAddressEmpty = isEmpty(formState?.getFieldValue('shipping_address'));
    const fetchAddressesByCustomerId = useActionCreator(
      shippingInfoActions.fetchAddressesByCustomerId,
    );

    const renderOptions = (shippingAddresses: ShippingAddress[]): CustomOptionType[] => {
      return shippingAddresses.map((address) => ({
        label: `${address.siteName}, ${address.siteAddress}`,
        value: address.id,
        siteContact: address.siteContact,
      }));
    };

    const fetchShippingAddressAsync = useAsync({
      onSuccess: (data?: DocumentRevision) => {
        const siteAddress = data?.formInput?.siteInformations as ShippingAddress[];
        if (isEmpty(siteAddress)) {
          return;
        }

        setOptions(renderOptions(siteAddress));
      },
      onError: toastError,
    });

    useEffect(() => {
      if ((!FB.isUUID(customerId) && isCustomerFieldLoading) || !customerId) {
        if (!isEmpty(shippingAddress)) {
          saveShippingAddressInfo();
        }
        return;
      }

      fetchShippingAddressAsync.start(
        fetchAddressesByCustomerId,
        customerId,
        FBAutocompleteAsyncOption.shippingInformation,
        fetchShippingAddressAsync,
      );
    }, [customerId]);

    useEffect(() => {
      if (!isEmpty(shippingAddress) && !isEmpty(options) && customerId && !options.some(option => option.value === defaultValue?.id)) {
        saveShippingAddressInfo();
      }
    }, [customerId, defaultValue, options]);

    const saveShippingAddressInfo = (value?: CustomOptionType) => {
      const contacts = value?.siteContact?.reduce<{attention?: ContactValue, shipping?: ContactValue}>((contacts, item) => {
        const contact = {
          id: item.id,
          name: [
            item.name?.trim() ? item.name : null,
            item.email?.trim() ? `(${item.email})` : null,
            item.phoneNumber?.trim() ? item.phoneNumber : null,
          ].filter(Boolean).join(' '),
        };
        if (item.attention) {
          contacts.attention = contact;
        }
        if (item.shipping) {
          contacts.shipping = contact;
        }

        return contacts;
      }, { attention: undefined, shipping: undefined });

      formState?.setFieldValue('shipping_address', !isEmpty(value) ? { id: value?.value, name: value?.label } : {});
      formState?.setFieldValue('shipping_address_attention', !isEmpty(value) ? contacts?.attention : {});
      formState?.setFieldValue('shipping_address_contact', !isEmpty(value) ? contacts?.shipping : {});
      workspaceState?.saveDocRev(formState?.getValues());
    };

    const handleChange = (event: ChangeEvent<{}>, value?: CustomOptionType) => {
      saveShippingAddressInfo(value);
    };

    const value = !isEmpty(defaultValue) ? options.find((option) => option.value === defaultValue?.id)
      : { label: defaultValue, value: defaultValue };

    return Component({
      ...props as T,
      name,
      disabled: disabled || isCustomerFieldEmpty || isCustomerFieldLoading,
      isLoading: fetchShippingAddressAsync.isLoading,
      isShippingAddressEmpty,
      value,
      handleChange,
      options,
    });
  };

  return (props: T) => Comp(props);
};
