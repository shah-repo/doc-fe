/* eslint-disable @typescript-eslint/no-unused-vars */
import { isEmpty } from 'lodash';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { FB, FBAutocompleteAsyncOption, FBAutocompleteAsyncState } from '..';
import { SHIPPING_ADDRESS_FIELDS, SHIPPING_CUSTOMER_FIELD } from './constants';
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
    const shippingAddress = useObserver(() => formState?.getFieldValue(SHIPPING_ADDRESS_FIELDS.ADDRESS) || workspaceState?.formInputSync.get(SHIPPING_ADDRESS_FIELDS.ADDRESS) || workspaceState?.formInput?.shippingAddress);
    const customerId = useObserver(() => formState?.getFieldValue(SHIPPING_CUSTOMER_FIELD) || workspaceState?.formInputSync.get(SHIPPING_CUSTOMER_FIELD) || workspaceState?.formInput?.customer);
    const isCustomerFieldLoading = useObserver(() => workspaceState?.documentRevApi.loading);
    const isCustomerFieldEmpty = isEmpty(formState?.getFieldValue(SHIPPING_CUSTOMER_FIELD));
    const isShippingAddressEmpty = isEmpty(formState?.getFieldValue(SHIPPING_ADDRESS_FIELDS.ADDRESS));

    const customersAsync = FB.useRef<FBAutocompleteAsyncState>(
      FBAutocompleteAsyncState,
      {
        optionId: FBAutocompleteAsyncOption.shippingInformation,
      },
    );

    useEffect(() => {
      customersAsync.load();
    }, [customersAsync]);

    const renderOptions = (shippingAddresses: ShippingAddress[]): CustomOptionType[] => {
      return shippingAddresses.map((address) => ({
        label: `${address.siteName} (${address.siteAddress}, ${address.city} ${address.zipCode}, ${address.country})`,
        value: address.id,
        siteContact: address.siteContact,
      }));
    };

    useEffect(() => {
      if ((!FB.isUUID(customerId) && isCustomerFieldLoading) || !customerId) {
        if (!isEmpty(shippingAddress)) {
          saveShippingAddressInfo();
        }
        return;
      }

      customersAsync.fetchAutocompleteOption(customerId, FBAutocompleteAsyncOption.shippingInformation);
    }, [customerId]);

    useEffect(
      () =>
        reaction(
          () => customersAsync.autocompleteValueApi.data,
          (data) => {
            if (data) {
              const siteAddress = data?.formInput
                ?.siteInformations as ShippingAddress[];
              setOptions(siteAddress ? renderOptions(siteAddress) : []);
            }
          },
        ),
      [],
    );

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
        if (item.isAttention) {
          contacts.attention = contact;
        }
        if (item.isShipping) {
          contacts.shipping = contact;
        }

        return contacts;
      }, { attention: undefined, shipping: undefined });

      formState?.setFieldValue(SHIPPING_ADDRESS_FIELDS.ADDRESS, !isEmpty(value) ? { id: value?.value, name: value?.label } : {});
      formState?.setFieldValue(SHIPPING_ADDRESS_FIELDS.ATTENTION, !isEmpty(value) ? contacts?.attention : {});
      formState?.setFieldValue(SHIPPING_ADDRESS_FIELDS.CONTACT, !isEmpty(value) ? contacts?.shipping : {});
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
      isLoading: customersAsync.loading,
      isShippingAddressEmpty,
      value,
      handleChange,
      options,
    });
  };

  return (props: T) => Comp(props);
};
