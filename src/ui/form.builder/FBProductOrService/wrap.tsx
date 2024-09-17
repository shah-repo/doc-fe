import { useEffect, useState } from 'react';
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
  const Comp = ({
    name = '',
    disabled,
    ...props
  }: T) => {
    const { workspaceState } = FB.useStores();
    const [productOrServices, setProductOrServices] = useState<ProductORService[]>();
    const fetchReferences = useActionCreator(documentRevisionsActions.fetchReferencesTableData);
    const referenceFormInput = workspaceState?.formInputSync.get(name) ?? [];

    const mergeArrays = (references: ProductORService[], selectedProductOrServices?: DocumentRevision[]) => {
      const map = new Map();

      references.forEach((item) => {
        map.set(item.revId, { ...item });
      });

      selectedProductOrServices?.forEach((item) => {
        const selectedProduct = map.get(item.id);
        const refObj = {
          itemDisplayName: translate('form.builder.supplier.references.displayRevision', {
            docId: item.document?.docId,
            displayRevision: item.displayRevision,
            name: item?.name,
            status: item.status,
          }),
          status: item.status,
          lifecyclePhase: item?.lifecyclePhase?.displayLabel,
          documentId: item.documentId,
          aslDisplayLabel: item?.mappedConfigDetails?.[selectedProduct.id]?.displayLabel,
        };
        // TODO add life cycle phase column

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
      if (!workspaceState?.documentId && !workspaceState?.formInputSync.get(name)) {
        return;
      }

      fetchOptionsDataAsync.start(
        fetchReferences,
        workspaceState?.id,
        (workspaceState?.formInputSync.get(name) ?? []).map((data) => data.revId),
        fetchOptionsDataAsync,
      );
    }, [workspaceState?.documentId, workspaceState?.formInput?.[name]]);

    return Component({
      ...props as T,
      name,
      disabled: disabled ?? workspaceState?.isPreview,
      productOrServices,
      setProductOrServices,
    });
  };

  return (props: T) => Comp(props);
};
