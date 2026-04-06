import { useObserver } from 'mobx-react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  const Comp = ({ name = '', disabled, ...props }: T) => {
    const { workspaceState } = FB.useStores();
    const [references, setReferences] = useState<Reference[]>();
    const fetchReferences = useActionCreator(
      documentRevisionsActions.fetchReferencesTableData,
    );

    const referenceFormInput = useObserver(() => workspaceState?.formInputSync.get(name) ?? []);

    const stableReferenceIds = useMemo(() => {
      return (referenceFormInput ?? []).map((data) => data.referenceRevId);
    }, [referenceFormInput]);

    const mergeArrays = (
      references: Reference[],
      selectedReferences?: DocumentRevision[],
    ): Reference[] => {
      const map = new Map();

      references.forEach((item: Reference) => {
        map.set(item.referenceRevId, { ...item });
      });

      selectedReferences?.forEach((item: DocumentRevision) => {
        const refObj = {
          referenceDisplayName: translate(
            'form.builder.supplier.references.displayRevision',
            {
              docId: item.document?.docId,
              displayRevision: item.displayRevision,
              name: item.name,
            },
          ),
          revision: item.displayRevision,
          title: item.name,
          status: item.displayStatus,
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

    const prevIdsRef = useRef<string[]>([]);

    useEffect(() => {
      if (!stableReferenceIds) {
        return;
      }

      const isSame
        = prevIdsRef.current.length === stableReferenceIds.length
        && prevIdsRef.current.every((id, index) => id === stableReferenceIds[index]);

      if (isSame) return;

      prevIdsRef.current = stableReferenceIds;

      fetchOptionsDataAsync.start(
        fetchReferences,
        workspaceState?.id,
        stableReferenceIds ?? [],
        fetchOptionsDataAsync,
      );
    }, [workspaceState?.documentId, stableReferenceIds]);

    return Component({
      ...(props as T),
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      references,
      setReferences,
    });
  };

  return (props: T) => Comp(props);
};
