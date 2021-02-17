
import { changeRequestsActions, changeRequestsSelectors } from "../../../../../state/ducks/changeRequest";
import { documentRevisionsActions, documentRevisionsSelectors } from "../../../../../state/ducks/documentRevisions";

export const getUrlandActions = (requestType) => {
  const urlAction = {
    document: [
      documentRevisionsActions.ownerChange,
      documentRevisionsSelectors.getDocumentRevision,
    ],
    // eslint-disable-next-line @typescript-eslint/camelcase
    change_request: [
      changeRequestsActions.save,
      changeRequestsSelectors.getChangeRequest,
    ],
    // task: [
    //   DOCUMENT_REVISION_ROOT_URL + `/implementation_plan_task/${requestId}`,
    //   changeRequestsSelectors.getChangeRequest,
    // ],
  };

  return urlAction[requestType];
};
