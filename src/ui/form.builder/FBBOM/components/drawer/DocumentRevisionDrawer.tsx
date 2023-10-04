import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Grid, IconButton } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { documentRevisionsActions, documentRevisionsSelectors } from '../../../../../state/ducks/documentRevisions';
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
  closeDrawer: () => void
}

const DocumentRevisionDrawer: React.FC<DocumentRevisionDrawerProps> = ({ dataItem, closeDrawer }) => {
  const classes = useStyles();
  const documentRevisionId = dataItem?.id.split(
    SELECTED_PART_KEY_SEPARATOR,
  )[0];
  const loadDocumentRevisionAsyncState = useSelector(
    documentRevisionsSelectors.getLoadAsyncDrawerState,
  );
  const documentRevision = useSelector((state: ApplicationState) => {
    return documentRevisionId && documentRevisionsSelectors.getDocumentRevision(state, documentRevisionId);
  });

  const loadDocumentRevision = useActionCreator(documentRevisionsActions.load);
  const loadAction = () =>
    loadDocumentRevision(
      documentRevisionId,
      DOCUMENT_REVISION_GET_ASYNC_DRAWER,
    );

  return (
    <Theme>
      <Box className={classes.drawer} data-cy="document-revision-drawer">
        <Grid item>
          <div className={classes.iconContainer}>
            <IconButton
              onClick={closeDrawer}
              aria-label="Close"
              disableFocusRipple
              disableRipple
              disableTouchRipple
              data-cy="close-alternate-part-list"
              className={classes.closeIcon}
            >
              <FontAwesomeIcon icon={regular('xmark')} />
            </IconButton>
          </div>
        </Grid>
        <AsyncGate
          asyncAction={loadAction}
          asyncState={loadDocumentRevisionAsyncState}
          startActionOnMount
        >
          {dataItem && documentRevision && (
            <DocumentRevisionUpdateContainer
              documentRevision={documentRevision}
              documentId={dataItem.documentId}
            />
          )}
        </AsyncGate>
      </Box>
    </Theme>
  );
};

export default DocumentRevisionDrawer;
