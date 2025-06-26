import { Mutex } from 'async-mutex';
import { FormikHelpers } from 'formik';
import CallbackHandler from '../../../../common/callbackHandler';
import { changeRequestsActions } from '../../../../state/ducks/changeRequest';
import { ChangeRequest, ChangeRequestEditRequestBody } from '../../../../state/ducks/changeRequest/types';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DocumentRevision, DocumentRevisionEditRequestBody } from '../../../../state/ducks/documentRevisions/types';
import { store } from '../../../../state/store';
import { DocumentRevisionFormValues } from '../../../../ui/documentRevision/forms/types';

const documentRevisionPatch = new Mutex();

export const saveDocumentRevision = async (
  id: string,
  data: DocumentRevisionEditRequestBody,
  helpers?: FormikHelpers<DocumentRevisionFormValues>,
): Promise<DocumentRevision> => {
  return await documentRevisionPatch.runExclusive(async () => {
    return await new Promise<DocumentRevision>((resolve, reject) => {
      const action = documentRevisionsActions.save(
        id,
        data,
        {
          successHandler: new CallbackHandler((data) => resolve(data)),
          errorHandler: new CallbackHandler((message) => reject(message)),
        },
        helpers,
      );
      store.dispatch(action);
    });
  });
};

const approvalRequestPatch = new Mutex();

export const saveApprovalRequest = async (
  id: string,
  data: ChangeRequestEditRequestBody,
): Promise<ChangeRequest> => {
  return await approvalRequestPatch.runExclusive(async () => {
    return await new Promise((resolve, reject) => {
      const action = changeRequestsActions.save(
        id,
        data,
        {
          successHandler: new CallbackHandler((data) => resolve(data)),
          errorHandler: new CallbackHandler((message) => reject(message)),
        },
      );
      store.dispatch(action);
    });
  });
};
