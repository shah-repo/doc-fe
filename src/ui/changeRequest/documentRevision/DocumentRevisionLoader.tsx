import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { documentRevisionsActions, documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import AsyncGate from "../../components/AsyncGate";
import DocumentRevisionUpdateContainer from "../../documentRevision/DocumentRevisionUpdate.container";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";

interface OwnProps {
  documentRevisionId: string;
  onDirtyFlagChange: (dirty: boolean) => void;
}

type Props = OwnProps;

export const DocumentRevisionLoader: React.FunctionComponent<Props> = ({
  documentRevisionId,
  onDirtyFlagChange,
}) => {

  const documentRevision = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, documentRevisionId),
  );
  const loadDocumentRevisionAsyncState = useSelector(documentRevisionsSelectors.getLoadAsyncState);
  const loadDocumentRevisionAction = useActionCreator(documentRevisionsActions.load);
  const async = useAsync();

  const loadDocumentRevision = () => async.start(loadDocumentRevisionAction, documentRevisionId, async);

  useEffect(() => {
    if (documentRevisionId) {
      loadDocumentRevision();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentRevisionId]);

  return (
    <AsyncGate
      asyncState={loadDocumentRevisionAsyncState}
      asyncAction={loadDocumentRevision}
      startActionOnMount={false}
    >
      {
        documentRevision &&
        <DocumentRevisionUpdateContainer
          documentRevision={documentRevision}
          onDirtyFlagChange={onDirtyFlagChange}
        />
      }
    </AsyncGate>
  );
};

export default DocumentRevisionLoader;
