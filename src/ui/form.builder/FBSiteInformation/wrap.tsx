import { orderBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { FB } from '..';
import { EditableSite, FBSiteProps, Site } from './types';

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

    const initialSites = useMemo(() => {
      return prepareData(formValue ?? workspaceState?.formInputSync.get(name) ?? []);
    }, [formValue, workspaceState?.formInputSync, name]);

    const [sites, setSites] = useState<EditableSite[]>(initialSites);

    useEffect(() => {
      console.log('initialSites :', initialSites);
      setSites(initialSites);
    }, [initialSites]);

    return Component({
      ...props as T,
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      sites,
      setSites,
    });
  };

  return (props: T) => Comp(props);
};
