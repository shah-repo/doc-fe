import { orderBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { FB } from '..';
import { Certification, FBCertificationProps } from './types';

const prepareData = (list: Certification[] = []) => orderBy(list, 'primary', 'desc');

export const withFBCertifications = <T extends FBCertificationProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const formValue = formState?.getFieldValue(name);

    const supplierContacts = useMemo(() => {
      return prepareData(formValue ?? workspaceState?.formInputSync.get(name) ?? []);
    }, [formValue, workspaceState?.formInputSync, name]);

    const [certifications, setCertifications] = useState<Certification[]>(supplierContacts);

    useEffect(() => {
      setCertifications(supplierContacts);
    }, [supplierContacts]);

    return Component({
      ...props as T,
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      certifications,
      setCertifications,
    });
  };

  return (props: T) => Comp(props);
};
