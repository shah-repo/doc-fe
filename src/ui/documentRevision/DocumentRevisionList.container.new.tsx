import { LinearProgress, List } from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DocumentRevisionSidebarState from '../../App/Enlil/Features/DocumentRevisionForm/Components/Sidebar/DocumentRevisionSidebar.state';
import { Nullable } from '../../state/ducks/common/types';
import { documentRevisionsActions, documentRevisionsSelectors } from '../../state/ducks/documentRevisions';
import { documentTypeSelectors } from '../../state/ducks/documentRevisions/documentType';
import { DocumentRevision } from '../../state/ducks/documentRevisions/types';
import { AsyncStatus } from '../../state/types';
import { styles } from './DocumentRevisionList.container.styles';
import DocumentRevisionListPresenter from './DocumentRevisionList.presenter.new';
import { checkIsDocumentPO } from './helpers/checkDocumentGroup';

interface OwnProps {
  documentRevisions: DocumentRevision[]
  documentId: string
  docId: string
  selectedDocumentRevision: Nullable<string>
  documentRevisionId: Nullable<string>
  documentTypeId?: string
  isInlineApproval: boolean
  isRecord: boolean
  _documentRevisionSidebarState?: DocumentRevisionSidebarState
}

type DocumentRevisionListContainerProps = OwnProps;

// used by the document revision manager container
const DocumentRevisionListContainer: React.FunctionComponent<
DocumentRevisionListContainerProps
> = ({
  documentRevisions,
  documentId,
  docId,
  selectedDocumentRevision,
  documentTypeId,
  isInlineApproval,
  isRecord,
  _documentRevisionSidebarState,
}) => {
  const classes = styles();
  const dispatch = useDispatch();
  const loadAsyncState = useSelector(documentRevisionsSelectors.getLoadDocumentAsyncState);
  const loading = ![AsyncStatus.Success, AsyncStatus.Error].includes(loadAsyncState.status);
  const loadDocumentAction = useCallback(() => {
    dispatch(documentRevisionsActions.loadDocument(documentId));
  }, [dispatch, documentId]);

  useEffect(() => {
    loadDocumentAction();
  }, [loadDocumentAction, documentId]);

  const documentTypeGroupOptions = useSelector(documentTypeSelectors.byId)[documentTypeId || '']?.groupOptions;
  const isDocumentPO = checkIsDocumentPO(documentTypeGroupOptions);

  return (
    <div className={classes.container}>
      {loading && <LinearProgress style={{ width: '100%' }} />}
      <List disablePadding>
        {
          documentRevisions.map((documentRevision) => (
            <DocumentRevisionListPresenter
              key={documentRevision.id}
              {...{
                documentRevision,
                docId,
                isInlineApproval,
                documentId,
                selectedDocumentRevision,
                documentTypeId,
                isDocumentPO,
                isRecord,
                _documentRevisionSidebarState,
              }}
            />
          ),
          )
        }
      </List>
    </div>
  );
};

export default DocumentRevisionListContainer;
