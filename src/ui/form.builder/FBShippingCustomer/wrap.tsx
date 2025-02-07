import { isEmpty } from 'lodash';
import { useObserver } from 'mobx-react';
import { useEffect, useState } from 'react';
import { FB } from '..';
import { ShippingActions } from '../../../state/ducks/Shipping';
import { toastError } from '../../components/notifications';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { CustomerRevisionInfo, FBShippingCustomerProps } from './types';

export const withFBShippingCustomer = <T extends FBShippingCustomerProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    ...props
  }: T) => {
    const { workspaceState, formState } = FB.useStores();
    const defaultValue = formState?.getFieldValue(name) ?? '';
    const [latestRevisionSummary, setLatestRevisionSummary] = useState<CustomerRevisionInfo>();
    const customerId = useObserver(() => formState?.getFieldValue(name) || workspaceState?.formInputSync.get(name) || workspaceState?.formInput?.customer);
    const isCustomerFieldEmpty = isEmpty(formState?.getFieldValue(name));
    console.log('customerId', customerId, isCustomerFieldEmpty, defaultValue);

    const fetchLatestRevisionSummary = useActionCreator(ShippingActions.fetchLatestRevisionDetailsByRevId);
    const latestRevisionSummaryAsync = useAsync<CustomerRevisionInfo>({
      onSuccess: (data) => {
        setLatestRevisionSummary(data);
      },
      onError: toastError,
    });

    useEffect(() => {
      latestRevisionSummaryAsync.start(fetchLatestRevisionSummary, customerId, latestRevisionSummaryAsync);
    }, []);

    const updateLatestAvailableRevision = () => {
      console.log('available rev');
    };

    const resetOBSCustomerSelection = () => {
      console.log('clear OBS customer');
    };

    return Component({
      ...props as T,
      updateLatestAvailableRevision,
      latestRevisionSummary: latestRevisionSummary ?? {
        hasOBSRevision: true,
        hasReleasedRevision: false,
        revisionDetails: { name: 'Latest' },
      },
      resetOBSCustomerSelection,
    });
  };

  return (props: T) => Comp(props);
};
