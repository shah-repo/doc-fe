import { useMemo } from "react";
import { useSelector } from "react-redux";
import { documentRevisionsSelectors } from "../../state/ducks/documentRevisions";
import { Document, DocumentRevisionStatus } from "../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../state/reducers";
import { getIsLastVersionObsolete, isDocumentRevisionDeprecated, isDocumentRevisionInStatus } from "../documentRevision/helpers/documentRevisionStatus";

const useShouldUpgradeToLatest = (
  documentStatus?: DocumentRevisionStatus,
  formDocumentStatus?: DocumentRevisionStatus,
  formDocumentId = "",
): boolean => {
  const isFormStatusDeprecated = isDocumentRevisionDeprecated(formDocumentStatus);
  const isDocumentStatusDraftOrPending =
    isDocumentRevisionInStatus([DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange], documentStatus);
  const formDocuments: Document = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocument(state, formDocumentId)
  );
  const isLastVersionObsolete = useMemo(() =>
    formDocuments && getIsLastVersionObsolete(formDocuments)
  , [formDocuments]);

  return isFormStatusDeprecated && isDocumentStatusDraftOrPending && !isLastVersionObsolete;
};

export default useShouldUpgradeToLatest;
