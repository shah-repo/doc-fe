import { orderBy } from 'lodash';
import { useObserver } from 'mobx-react';
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
    const sitesList = useObserver(() => workspaceState?.formInputSync.get(name));

    const initialSites = useMemo(() => {
      return orderBy(formValue ?? sitesList ?? [], 'isPrimary', 'desc');
    }, [formValue, sitesList, name]);

    const [sites, setSites] = useState<EditableSite[]>();

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
