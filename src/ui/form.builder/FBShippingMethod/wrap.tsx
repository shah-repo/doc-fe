import { isEmpty } from 'lodash';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import { useEffect, useState } from 'react';
import { FB, FBAutocompleteAsyncOption, FBAutocompleteAsyncState } from '..';
import { SHIPPING_CUSTOMER_FIELD } from '../FBShippingInfo/constants';
import { FBShippingMethodProps } from './types';

export const withFBShippingMethod = <T extends FBShippingMethodProps>(Component: React.FC<T>): React.FC<T> => {
  const Comp = (props: T) => {
    const { name = '' } = props;
    const { workspaceState, formState } = FB.useStores();
    const defaultValue = formState?.getFieldValue(name) ?? '';
    const [selectedCustomerMethod, setSelectedCustomerInfo] = useState();
    const isCustomerFieldLoading = useObserver(() => workspaceState?.documentRevApi.loading);
    const customerId = useObserver(
      () =>
        formState?.getFieldValue(SHIPPING_CUSTOMER_FIELD)
        || workspaceState?.formInputSync.get(SHIPPING_CUSTOMER_FIELD)
        || workspaceState?.formInput?.customer,
    );

    const customersAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
      optionId: FBAutocompleteAsyncOption.shippingInformation,
    });

    useEffect(() => {
      customersAsync.load();
    }, [customersAsync]);

    useEffect(() => {
      if ((!FB.isUUID(customerId) && isCustomerFieldLoading) || !customerId) {
        saveShippingAddressInfo();
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
              console.log('selected customer data ', data);
              setSelectedCustomerInfo(data?.formInput?.siteInformation); // this should be shipping method
            }
          },
        ),
      [],
    );

    useEffect(() => {
      if (customerId) {
        saveShippingAddressInfo();
      }
    }, [customerId]);

    const saveShippingAddressInfo = () => {
      formState?.setFieldValue(name, 'updated value');
      console.log('formState?.getValues()', formState?.getValues());
      // enable this at last
      // workspaceState?.saveDocRev(formState?.getValues());
    };

    console.log('customerId : ', customerId);

    const value
      = !isEmpty(defaultValue) && selectedCustomerMethod
        ? selectedCustomerMethod
        : { label: defaultValue, value: defaultValue };

    console.log('value', value);

    return Component({
      ...props,
    });
  };

  return (props: T) => Comp(props);
};
