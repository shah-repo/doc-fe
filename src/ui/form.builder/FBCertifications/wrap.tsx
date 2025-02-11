import { orderBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { FB } from '..';
import { Certification, FBCertificationProps } from './types';

export const withFBCertifications = <T extends FBCertificationProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({ name = '', disabled, ...props }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const formValue = formState?.getFieldValue(name);

    const initialCertifications = useMemo(() => {
      return orderBy(formValue ?? workspaceState?.formInputSync.get(name) ?? [], 'primary', 'desc');
    }, [formValue, workspaceState?.formInputSync, name]);

    const [certifications, setCertifications] = useState<Certification[]>(
      initialCertifications,
    );

    useEffect(() => {
      setCertifications(initialCertifications);
    }, [initialCertifications]);

    return Component({
      ...(props as T),
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      certifications,
      setCertifications,
    });
  };

  return (props: T) => Comp(props);
};
