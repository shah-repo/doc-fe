import { orderBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { FB } from '..';
import { FBSupplierContactsProps, SupplierContact } from './types';

const prepareData = (list: SupplierContact[] = []) => orderBy(list, 'isPrimary', 'desc');

export const withFBSiteInformation = <T extends FBSupplierContactsProps>(
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

    const [contacts, setContacts] = useState<SupplierContact[]>(supplierContacts);

    useEffect(() => {
      setContacts(supplierContacts);
    }, [supplierContacts]);

    const updateState = (state: SupplierContact[]) => {
      setContacts(prepareData(state));
      formState?.setFieldValue(name, state);
      formState?.setFieldAutosave(name);
    };

    const updatePrimaryContact = (id: string, contacts: SupplierContact[]) => contacts.map(item => ({
      ...item,
      isPrimary: item.id === id,
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
      setContacts,
      setPrimaryContact,
    });
  };

  return (props: T) => Comp(props);
};
