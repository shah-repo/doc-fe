import { differenceBy, orderBy, unionBy } from 'lodash';
import { useState } from 'react';
import { FB } from '..';
import { FBReferenceProps, Reference } from './types';

const prepareData = (list: Reference[] = []) => orderBy(list, 'primary', 'desc');

const demoReferences = [
  {
    referenceId: 'ABC',
    revision: 2,
    title: 'Title test',
    status: 'ACCEPTED',
    owner: '',
    createdDate: '2024-07-04T03:38:11.343Z',
  },
];
export const withFBReferences = <T extends FBReferenceProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const [references, setReferences] = useState<Reference[]>(prepareData(workspaceState?.formInputSync.get(name) ?? demoReferences));

    const updateState = (state: Reference[]) => {
      setReferences(prepareData(state));
      formState?.setFieldValue(name, state);
      formState?.setFieldAutosave(name);
    };

    const deleteReference = (item: Reference) => {
      const filteredContacts = differenceBy(references, [item], 'id');
      updateState(filteredContacts);
    };

    const updateReference = (item: Reference) => {
      const newReferences = unionBy([item], references, 'id');
      updateState(newReferences);
    };

    return Component({
      ...props as T,
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      references,
      deleteReference,
      updateReference,
    });
  };

  return (props: T) => Comp(props);
};
