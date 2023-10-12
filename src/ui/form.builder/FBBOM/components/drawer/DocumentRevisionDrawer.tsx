import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Grid, IconButton } from '@material-ui/core';
import { useObserver } from 'mobx-react';
import React, { useEffect, useState } from 'react';
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
import FBDataStore from '../../../FBStore/FBDataStore';
import { EditableBOM } from '../../interface';
import { SELECTED_PART_KEY_SEPARATOR } from '../treelist/constants';
import useStyles from './styles';
interface DocumentRevisionDrawerProps {
  dataItem?: EditableBOM
  closeDrawer: () => void
  isSliderView?: boolean
}
const DocumentRevisionDrawer: React.FC<DocumentRevisionDrawerProps> = ({
  dataItem,
  closeDrawer,
  isSliderView,
}) => {
  const classes = useStyles();
  const [documentId, seDocId] = useState(
    FBDataStore.selectedSliderInfo?.documentId
      ? FBDataStore.selectedSliderInfo?.documentId
      : dataItem?.documentId,
  );
  const [rerender, setRerender] = useState(false);
  const documentRevisionId = FBDataStore.selectedSliderInfo?.documentRevision
    ?.id
    ? FBDataStore.selectedSliderInfo?.documentRevision?.id
    : dataItem?.id.split(SELECTED_PART_KEY_SEPARATOR)[0];
  const [docRevId, seDocRevId] = useState(documentRevisionId);
  const loadDocumentRevisionAsyncState = useSelector(
    documentRevisionsSelectors.getLoadAsyncDrawerState,
  );
  const documentRevision = useSelector((state: ApplicationState) => {
    return (
      docRevId
      && documentRevisionsSelectors.getDocumentRevision(state, docRevId)
    );
  });
  useEffect(() => {
    if (docRevId !== documentRevision?.id) {
      setTimeout(() => {
        setRerender(!rerender);
      }, 1000);
    }
  }, [docRevId]);

  const loadDocumentRevision = useActionCreator(documentRevisionsActions.load);
  const loadAction = () =>
    loadDocumentRevision(docRevId, DOCUMENT_REVISION_GET_ASYNC_DRAWER);
  useObserver(() => {
    if (
      isSliderView
      && documentRevision
      && FBDataStore.selectedSliderInfo?.documentRevision
      && FBDataStore.selectedSliderInfo?.documentRevision?.id !== docRevId
    ) {
      if (
        documentRevision?.id
        !== FBDataStore.selectedSliderInfo?.documentRevision?.id
      ) {
        seDocId(FBDataStore.selectedSliderInfo?.documentId);
        seDocRevId(FBDataStore.selectedSliderInfo?.documentRevision?.id);
      }
    }
  });

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
        {rerender && (
          <AsyncGate
            asyncAction={loadAction}
            asyncState={loadDocumentRevisionAsyncState}
            startActionOnMount
          >
            {dataItem && documentRevision && (
              <DocumentRevisionUpdateContainer
                documentRevision={documentRevision}
                documentId={documentId}
                isSliderView={true}
              />
            )}
          </AsyncGate>
        )}
        {!rerender && (
          <AsyncGate
            asyncAction={loadAction}
            asyncState={loadDocumentRevisionAsyncState}
            startActionOnMount
          >
            {dataItem && documentRevision && (
              <DocumentRevisionUpdateContainer
                documentRevision={documentRevision}
                documentId={documentId}
                isSliderView={true}
              />
            )}
          </AsyncGate>
        )}
      </Box>
    </Theme>
  );
};
export default DocumentRevisionDrawer;
