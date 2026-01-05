import { useObserver } from 'mobx-react';
import { useEffect } from 'react';
import { translate } from '../../../../../common/intl';
import { DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import FBAutocompleteAsyncState from '../../../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../../../helpers';
import { MaterialOption } from '../types';

export const useFetchData = ({ isEBProcedure }) => {
  const materialState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.materials,
  });

  useEffect(() => {
    materialState.load();
  }, [materialState]);

  const allowedStatuses = isEBProcedure
    ? [DocumentRevisionStatus.Released, DocumentRevisionStatus.Draft]
    : [DocumentRevisionStatus.Released];

  return useObserver(() => {
    const materialMap = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.materials) as Map<
    string,
    MaterialOption
    >;

    const materialSelectOptions = materialMap
      ? Array.from(materialMap.values()).filter(data => allowedStatuses.includes(data.status)).map((material) => ({
        label: translate('common.select.revision', {
          docId: material.document.docId,
          displayRevision: material?.displayRevision,
          name: material?.name,
        }),
        value: material.id,
      }))
      : [];

    return {
      materialSelectOptions,
    };
  });
};
