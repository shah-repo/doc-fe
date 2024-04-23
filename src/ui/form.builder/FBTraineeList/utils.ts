import { reaction } from 'mobx';
import { useEffect, useState } from 'react';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { documentRevisionQueryStatus } from '../../document.revision/utils/helpers';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import FBAutocompleteAsyncState from '../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../helpers';
import { DocumentRevisionOption, UseOptionsHook } from './types';

export const getOptionLabel = (option: DocumentRevisionOption): string => {
  const baseLabel = `${option.document?.docId} - rev ${option.displayRevision}`;
  return option.name ? `${baseLabel} - ${option.name}` : baseLabel;
};

export const useOptions: UseOptionsHook = (trainees) => {
  const getStatusesAction = useActionCreator(documentRevisionsActions.getDocRevStatuses);
  const [statuses, saveStatuses] = useState<DocumentRevisionStatus[]>([]);
  const async = useAsync<DocumentRevisionStatus[]>({ onSuccess: response => saveStatuses(response ?? []) });

  const trainingAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.trainingDocuments,
  });

  useEffect(() => {
    trainingAsync.load();
  }, [trainingAsync]);

  useEffect(() => {
    async.start(getStatusesAction, async, documentRevisionQueryStatus(), [], 'Training');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (trainingAsync.loading) {
      return;
    }
    const missedTrainees = trainees.filter(
      trainee => !trainee.status && !trainees.some(option => option.id === trainee.id),
    );
    missedTrainees.forEach(trainee => trainingAsync.fetchAutocompleteOption(trainee.id, FBAutocompleteAsyncOption.trainingDocuments));
  }, [trainees]);

  useEffect(() => reaction(
    () => trainingAsync.autocompleteValueApi.data,
    (data) => {
      if (data) {
        FBAutocompleteAsyncStore.add(FBAutocompleteAsyncOption.suppliers, data.id, {
          ...data,
          isUnselectable: true,
        });
      }
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);

  return {
    statuses,
  };
};
