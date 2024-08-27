import { useState } from 'react';
import { FB } from '..';
import { FBReferenceProps, Reference } from './types';

export const withFBReferences = <T extends FBReferenceProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const { workspaceState } = FB.useStores();
    const [references, setReferences] = useState<Reference[]>(workspaceState?.formInputSync.get(name) ?? []);

    return Component({
      ...props as T,
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      references,
      setReferences,
    });
  };

  return (props: T) => Comp(props);
};
