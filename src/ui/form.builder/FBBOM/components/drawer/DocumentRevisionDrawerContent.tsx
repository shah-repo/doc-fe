import { Box } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { documentRevisionsActions, documentRevisionsSelectors } from '../../../../../state/ducks/documentRevisions';
import { DOCUMENT_REVISION_GET_ASYNC_DRAWER } from '../../../../../state/ducks/documentRevisions/constants';
import { ApplicationState } from '../../../../../state/reducers';
import AsyncGate from '../../../../components/AsyncGate';
import DocumentRevisionUpdateContainer from '../../../../documentRevision/DocumentRevisionUpdate.container';
import useActionCreator from '../../../../hooks/useActionCreator';
import { EditableBOM } from '../../interface';

interface DocumentRevisionDrawerContentProps {
  dataItem?: EditableBOM
}

const DocumentRevisionDrawerContent: React.FunctionComponent<DocumentRevisionDrawerContentProps> = ({ dataItem }) => {
  const documentRevisionId = dataItem?.id.split('$$$')[0];
  const loadDocumentRevisionAsyncState = useSelector(documentRevisionsSelectors.getLoadAsyncDrawerState);
  const documentRevision = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, documentRevisionId));

  const loadDocumentRevision = useActionCreator(documentRevisionsActions.load);
  const loadAction = () => loadDocumentRevision(documentRevisionId, DOCUMENT_REVISION_GET_ASYNC_DRAWER);

  return (
    <Box margin="10px" height="100%" width="728px">
      <AsyncGate asyncAction={loadAction} asyncState={loadDocumentRevisionAsyncState} startActionOnMount={true}>
        {documentRevision && <DocumentRevisionUpdateContainer
          documentRevision={documentRevision}
          documentId={dataItem?.documentId as string}
          canChangeOwnerShip={false}
          isNewVersion={false}
        />}
      </AsyncGate>
    </Box>
  );
};

export default DocumentRevisionDrawerContent;
