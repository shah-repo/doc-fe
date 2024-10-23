import { orderBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { FB } from '../..';
import { FBSiteProps, Site } from '../types';

const prepareData = (list: Site[] = []) => orderBy(list, 'isPrimary', 'desc');

export const withFBSiteInformation = <T extends FBSiteProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const formValue = formState?.getFieldValue(name);

    // should pass from top parent component
    const initialSiteContacts = useMemo(() => {
      return prepareData(formValue ?? workspaceState?.formInputSync.get(name) ?? []);
    }, [formValue, workspaceState?.formInputSync, name]);

    const [siteContact, setSiteContact] = useState<Site[]>(initialSiteContacts);

    useEffect(() => {
      console.log('initialSite contacts :', initialSiteContacts);
      setSiteContact(initialSiteContacts);
    }, [initialSiteContacts]);

    return Component({
      ...props as T,
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      siteContact,
      setSiteContact,
    });
  };

  return (props: T) => Comp(props);
};
