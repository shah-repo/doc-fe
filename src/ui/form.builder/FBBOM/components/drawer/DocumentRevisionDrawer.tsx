import { Box } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  documentRevisionsActions,
  documentRevisionsSelectors,
} from '../../../../../state/ducks/documentRevisions';
import { DOCUMENT_REVISION_GET_ASYNC_DRAWER } from '../../../../../state/ducks/documentRevisions/constants';
import { ApplicationState } from '../../../../../state/reducers';
import AsyncGate from '../../../../components/AsyncGate';
import DocumentRevisionUpdateContainer from '../../../../documentRevision/DocumentRevisionUpdate.container';
import useActionCreator from '../../../../hooks/useActionCreator';
import Theme from '../../../../layout/theme/provider';
import { EditableBOM } from '../../interface';
import { SELECTED_PART_KEY_SEPARATOR } from '../treelist/constants';
import useStyles from './styles';

interface DocumentRevisionDrawerProps {
  dataItem?: EditableBOM
}

const DocumentRevisionDrawer: React.FC<
DocumentRevisionDrawerProps
> = ({ dataItem }) => {
  const classes = useStyles();
  const documentRevisionId = dataItem?.id.split(
    SELECTED_PART_KEY_SEPARATOR,
  )[0] as string;
  const loadDocumentRevisionAsyncState = useSelector(
    documentRevisionsSelectors.getLoadAsyncDrawerState,
  );
  const documentRevision = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, documentRevisionId),
  );

  const loadDocumentRevision = useActionCreator(documentRevisionsActions.load);
  const loadAction = () =>
    loadDocumentRevision(
      documentRevisionId,
      DOCUMENT_REVISION_GET_ASYNC_DRAWER,
    );

  return (
    <Theme>
      <Box className={classes.drawer}>
        <AsyncGate
          asyncAction={loadAction}
          asyncState={loadDocumentRevisionAsyncState}
          startActionOnMount={true}
        >
          {documentRevision && (
            <DocumentRevisionUpdateContainer
              documentRevision={documentRevision}
              documentId={dataItem?.documentId as string}
              canChangeOwnerShip={false}
              isNewVersion={false}
            />
          )}
        </AsyncGate>
      </Box>
    </Theme>
  );
};

export default DocumentRevisionDrawer;
