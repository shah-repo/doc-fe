
import { changeRequestsActions, changeRequestsSelectors } from "../../../../../state/ducks/changeRequest";
import { documentRevisionsActions, documentRevisionsSelectors } from "../../../../../state/ducks/documentRevisions";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../../../state/ducks/documentRevisions/constants";

export const getUrlandActions = (requestType, requestId) => {
  const urlAction = {
    document: [
      documentRevisionsActions.save,
      documentRevisionsSelectors.getDocumentRevision,
    ],
    change_request: [
      changeRequestsActions.save,
      changeRequestsSelectors.getChangeRequest,
    ],
    task: [
      DOCUMENT_REVISION_ROOT_URL + `/implementation_plan_task/${requestId}`,
      changeRequestsSelectors.getChangeRequest,
    ],
  };

  return urlAction[requestType];
};
