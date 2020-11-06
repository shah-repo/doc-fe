import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Document, documentRevisionsSelectors, DocumentRevisionStatus } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { getIsLastVersionObsolete } from "../documentRevision/helpers/documentRevisionStatus";

const useShouldUpgradeToLatest = (
  documentStatus?: DocumentRevisionStatus,
  formDocumentStatus?: DocumentRevisionStatus,
  formDocumentId = "",
): boolean => {
  const isFormStatusDeprecated = formDocumentStatus === DocumentRevisionStatus.Deprecated;
  const isDocumentStatusDraftOrPending =
    documentStatus === DocumentRevisionStatus.Draft || documentStatus === DocumentRevisionStatus.PendingChange;
  const formDocuments: Document = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocument(state, formDocumentId)
  );
  const isLastVersionObsolete = useMemo(() =>
    formDocuments && getIsLastVersionObsolete(formDocuments)
  , [formDocuments]);

  return isFormStatusDeprecated && isDocumentStatusDraftOrPending && !isLastVersionObsolete;
};

export default useShouldUpgradeToLatest;
