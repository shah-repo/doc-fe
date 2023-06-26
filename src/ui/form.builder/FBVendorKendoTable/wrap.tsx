import { useState } from 'react';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { FB } from '../helpers';
import { VendorData, VendorDataProps } from './types';
import { getVendorData } from './utils';

export const withFBVendorData = <T extends VendorDataProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const { workspaceState } = FB.useStores();

    const [items, setItems] = useState<VendorData[]>(getVendorData());

    const isFirstDraft = !disabled && workspaceState?.document?.version === 1;
    const userCanEditReleased = workspaceState?.document?.status === DocumentRevisionStatus.Released;
    const userCanEditNextDraft = (
      !disabled || (
        workspaceState?.document?.status === DocumentRevisionStatus.Draft
        && workspaceState?.document?.version > 1
      )
    );

    const isEditable = isFirstDraft || userCanEditReleased || userCanEditNextDraft;

    const addVendorData = (item: VendorData) => {
      setItems([...items, item]);
    };

    return Component({
      ...props as T,
      name,
      items,
      disabled: !isEditable,
      addVendorData,
    });
  };

  return (props: T) => Comp(props);
};
