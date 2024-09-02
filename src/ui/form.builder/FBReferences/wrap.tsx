import { useEffect, useState } from 'react';
import { FB } from '..';
import { translate } from '../../../common/intl';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
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
    const [references, setReferences] = useState<Reference[]>();
    const fetchReferences = useActionCreator(documentRevisionsActions.fetchReferencesTableData);
    const referenceFormInput = workspaceState?.formInputSync.get(name) ?? [];

    const mergeArrays = (references: Reference[], selectedReferences?: DocumentRevision[]) => {
      const map = new Map();

      references.forEach((item) => {
        map.set(item.referenceRevId, { ...item });
      });

      selectedReferences?.forEach((item) => {
        const refObj = {
          referenceDisplayName: translate('form.builder.supplier.references.displayRevision', {
            docId: item.document?.docId,
            displayRevision: item.displayRevision,
            name: item?.name,
            status: item.status,
          }),
          revision: item.displayRevision,
          title: item?.name,
          status: item.status,
          createdDate: item.createdAt,
          documentId: item.documentId,
          owner: item.owner.user.id,
        };

        map.set(item.id, { ...map.get(item.id), ...refObj });
      });

      return Array.from(map.values());
    };

    const fetchOptionsDataAsync = useAsync<DocumentRevision[]>({
      onSuccess: (data) => {
        setReferences(mergeArrays(referenceFormInput, data));
      },
    });

    useEffect(() => {
      if (!workspaceState?.documentId && !workspaceState?.formInputSync.get(name)) {
        return;
      }
      fetchOptionsDataAsync.start(
        fetchReferences,
        workspaceState?.documentId,
        (workspaceState?.formInputSync.get(name) ?? []).map((data) => data.referenceRevId),
        fetchOptionsDataAsync,
      );
    }, [workspaceState?.documentId, workspaceState?.formInput?.[name]]);

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
