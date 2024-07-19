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
import CloneContainer from '../../../../documentRevision/Clone.container';
import DocumentRevisionUpdateContainer from '../../../../documentRevision/DocumentRevisionUpdate.container';
import useActionCreator from '../../../../hooks/useActionCreator';
import Theme from '../../../../layout/theme/provider';
import { EditableAllocationItem } from '../../../FBAllocation/interface';
import FBDataStore from '../../../FBStore/FBDataStore';
import { EditableBOM } from '../../interface';
import { SELECTED_PART_KEY_SEPARATOR } from '../treelist/constants';
import useStyles from './styles';
interface DocumentRevisionDrawerProps {
  dataItem?: EditableBOM | EditableAllocationItem
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
  const [reRender, setRerender] = useState(false);
  const documentRevisionId = FBDataStore.selectedSliderInfo?.documentRevision
    ?.id
    ? FBDataStore.selectedSliderInfo?.documentRevision?.id
    : dataItem?.id?.split(SELECTED_PART_KEY_SEPARATOR)[0];
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
        setRerender(!reRender);
      }, 1000);
    }
  }, [docRevId]);

  const loadDocumentRevision = useActionCreator(documentRevisionsActions.load);
  const loadAction = () =>
    loadDocumentRevision(docRevId, DOCUMENT_REVISION_GET_ASYNC_DRAWER);
  useObserver(() => {
    const selectedDocRev = FBDataStore.selectedSliderInfo?.documentRevision;
    const selectedDocRevId = selectedDocRev?.id;
    if (
      isSliderView
      && documentRevision
      && selectedDocRev
      && selectedDocRevId !== docRevId
      && documentRevision.id !== selectedDocRevId
    ) {
      seDocId(FBDataStore.selectedSliderInfo.documentId);
      seDocRevId(selectedDocRevId);
    }
    if (FBDataStore?.selectedSliderInfo?.reRender) {
      FBDataStore.selectedSliderInfo.reRender = false;
      setRerender(!reRender);
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
        {reRender && !FBDataStore.selectedSliderInfo?.displayCloneContainer && (
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
        {!reRender && !FBDataStore.selectedSliderInfo?.displayCloneContainer && (
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
        {reRender && FBDataStore.selectedSliderInfo?.displayCloneContainer && <CloneContainer documentRevision={documentRevision} type="newVersion" isNewVersion={FBDataStore.selectedSliderInfo?.isNewVersion ?? true} isSliderView={true} />}
        {!reRender && FBDataStore.selectedSliderInfo?.displayCloneContainer && <CloneContainer documentRevision={documentRevision} type="newVersion" isNewVersion={FBDataStore.selectedSliderInfo?.isNewVersion ?? true} isSliderView={true} />}
      </Box>
    </Theme>
  );
};
export default DocumentRevisionDrawer;
