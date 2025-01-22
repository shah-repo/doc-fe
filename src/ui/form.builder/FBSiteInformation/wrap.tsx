import { orderBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { FB } from '..';
import { EditableSite, FBSiteProps } from './types';

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
      return orderBy(formValue ?? workspaceState?.formInputSync.get(name) ?? [], 'isPrimary', 'desc');
    }, [formValue, workspaceState?.formInputSync, name]);

    const [sites, setSites] = useState<EditableSite[]>(initialSites);

    useEffect(() => {
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
