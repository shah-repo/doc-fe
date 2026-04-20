import { useObserver } from 'mobx-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FB } from '..';
import { translate } from '../../../common/intl';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { FBProductORServiceProps, ProductORService } from './types';

export const withFBProductORService = <T extends FBProductORServiceProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({ name = '', disabled, ...props }: T) => {
    const { workspaceState } = FB.useStores();
    const [productOrServices, setProductOrServices]
      = useState<ProductORService[]>();
    const fetchReferences = useActionCreator(
      documentRevisionsActions.fetchReferencesTableData,
    );
    const referenceFormInput = useObserver(() => workspaceState?.formInputSync.get(name) ?? []);

    const stableProductOrServiceIds = useMemo(() => {
      return (referenceFormInput ?? []).map((data) => data.revId);
    }, [referenceFormInput]);

    const prevIdsRef = useRef<string[]>([]);

    const mergeArrays = (
      references: ProductORService[],
      selectedProductOrServices?: DocumentRevision[],
    ) => {
      const map = new Map();

      references.forEach((item) => {
        map.set(item.revId ?? item.id, { ...item });
      });

      selectedProductOrServices?.forEach((item) => {
        const selectedProduct = map.get(item.id);
        const refObj = {
          itemDisplayName: translate(
            'form.builder.supplier.references.displayRevision',
            {
              docId: item.document?.docId,
              displayRevision: item.displayRevision,
              name: item?.name,
              status: item.displayStatus,
            },
          ),
          status: item.displayStatus,
          lifecyclePhase: item?.lifecyclePhase?.displayLabel,
          documentId: item.documentId,
          aslDisplayLabel:
            item?.mappedConfigDetails?.[selectedProduct.id]?.displayLabel,
        };

        map.set(item.id, { ...selectedProduct, ...refObj });
      });

      return Array.from(map.values());
    };

    const fetchOptionsDataAsync = useAsync<DocumentRevision[]>({
      onSuccess: (data) => {
        setProductOrServices(mergeArrays(referenceFormInput, data));
      },
    });

    useEffect(() => {
      if (!stableProductOrServiceIds) {
        return;
      }

      const isSame
        = prevIdsRef.current.length === stableProductOrServiceIds.length
        && prevIdsRef.current.every((id, index) => id === stableProductOrServiceIds[index]);

      if (isSame) return;

      prevIdsRef.current = stableProductOrServiceIds;

      fetchOptionsDataAsync.start(
        fetchReferences,
        workspaceState?.id,
        stableProductOrServiceIds ?? [],
        fetchOptionsDataAsync,
      );
    }, [workspaceState?.documentId, stableProductOrServiceIds]);

    return Component({
      ...(props as T),
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      productOrServices,
      setProductOrServices,
    });
  };

  return (props: T) => Comp(props);
};
