import { differenceBy, orderBy, unionBy } from 'lodash';
import { useState } from 'react';
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
    const [contacts, setContacts] = useState<Certification[]>(prepareData(workspaceState?.formInputSync.get(name) ?? []));

    const updateState = (state: Certification[]) => {
      setContacts(prepareData(state));
      formState?.setFieldValue(name, state);
      formState?.setFieldAutosave(name);
    };

    const deleteCertification = (item: Certification) => {
      const filteredContacts = differenceBy(contacts, [item], 'id');
      updateState(filteredContacts);
    };

    const updateCertification = (item: Certification) => {
      const newContacts = unionBy([item], contacts, 'id');
      updateState(newContacts);
    };

    return Component({
      ...props as T,
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      contacts,
      deleteCertification,
      updateCertification,
    });
  };

  return (props: T) => Comp(props);
};
