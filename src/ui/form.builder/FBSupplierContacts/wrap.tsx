import { differenceBy, orderBy, unionBy } from 'lodash';
import { useState } from 'react';
import { FB } from '..';
import { FBSupplierContactsProps, SupplierContact } from './types';

const prepareData = (list: SupplierContact[] = []) => orderBy(list, 'primary', 'desc');

export const withFBSupplierContacts = <T extends FBSupplierContactsProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const [contacts, setContacts] = useState<SupplierContact[]>(prepareData(workspaceState?.formInputSync.get(name) ?? []));
    // const { suppliers, units, statuses } = useOptions(contacts.map(v => v.vendor));

    const updateState = (state: SupplierContact[]) => {
      setContacts(prepareData(state));
      formState?.setFieldValue(name, state);
      formState?.setFieldAutosave(name);
    };

    const deleteContact = (item: SupplierContact, updatedPrimaryContactId?: string) => {
      const filteredContacts = differenceBy(contacts, [item], 'id');
      const updatedContacts
        = updatedPrimaryContactId
          ? updatePrimaryContact(updatedPrimaryContactId, filteredContacts)
          : filteredContacts;
      updateState(updatedContacts);
    };

    const updateContact = (item: SupplierContact) => {
      const newContacts = unionBy([item], contacts, 'id');
      const updatedContacts = item.primary ? updatePrimaryContact(item.id, newContacts) : newContacts;
      updateState(updatedContacts);
    };

    const updatePrimaryContact = (id: string, contacts: SupplierContact[]) => contacts.map(item => ({
      ...item,
      primary: item.id === id,
    }));

    const setPrimaryContact = (id: string) => {
      const updatedContacts = updatePrimaryContact(id, contacts);
      updateState(updatedContacts);
    };

    return Component({
      ...props as T,
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      contacts,
      deleteContact,
      updateContact,
      setPrimaryContact,
    });
  };

  return (props: T) => Comp(props);
};
