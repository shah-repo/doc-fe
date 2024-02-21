import { useEffect } from 'react';
import { FB } from '../../../../form.builder';
import { CreateRelatedEquipmentInput, RelatedEquipmentsProps } from './types';
import RelatedEquipmentsState from './state';
import { useObserver } from 'mobx-react';
import { get, map, uniq } from 'lodash';
import { useDispatch } from 'react-redux';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { shouldHaveEditableRelatedEquipments, shouldFetchRelatedEquipments } from './index';

export const withRelatedEquipments = <T extends RelatedEquipmentsProps>(Component: React.FC<T>): React.FC<T> => {
  const Comp = (props: T) => {
    const { parentDocumentRevision } = props;
    const dispatch = useDispatch();

    const { workspaceState } = FB.useStores();
    const relatedEquipmentsState = FB.useRef<RelatedEquipmentsState>(RelatedEquipmentsState, {
      parentSpecificationId: parentDocumentRevision.id,
    });

    useEffect(() => {
      if (shouldFetchRelatedEquipments(parentDocumentRevision)) {
        relatedEquipmentsState.getRelatedEquipments();
      }
    }, [parentDocumentRevision, relatedEquipmentsState]);

    const relatedEquipments = useObserver(() => relatedEquipmentsState.relatedEquipments);
    const loading = useObserver(() => relatedEquipmentsState.loading);
    const statuses = uniq(relatedEquipments.map(item => item.status));

    const addRelatedEquipment = (input: CreateRelatedEquipmentInput): void => {
      const { docId, documentTypeId, formDocumentId, ...restInput } = input;

      relatedEquipmentsState
        .addRelatedEquipment({
          ...restInput,
          parentDocumentRevisionId: parentDocumentRevision.id,
          document: {
            docId,
            securityList: {
              securityEmployees: map(get(parentDocumentRevision, 'document.securityEmployees', []), ({ id }) => ({ id })),
              securityGroups: map(get(parentDocumentRevision, 'document.securityGroups', []), ({ id }) => ({ id })),
              operators: map(get(parentDocumentRevision, 'document.operators', []), ({ id }) => ({ id })),
            },
            documentType: {
              id: documentTypeId,
            },
          },
          formDocument: {
            id: formDocumentId,
          },
        })
        .then(() => dispatch(documentRevisionsActions.loadAudit(parentDocumentRevision.id)));
    };

    const disabled = props.disabled
      ?? workspaceState?.isPreview
      ?? !shouldHaveEditableRelatedEquipments(parentDocumentRevision);

    return Component({
      ...props,
      disabled,
      loading: props.loading ?? loading,
      relatedEquipments,
      statuses,
      addRelatedEquipment,
    });
  };

  return (props: T) => Comp(props);
};
