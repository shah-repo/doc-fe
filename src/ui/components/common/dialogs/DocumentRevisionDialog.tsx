import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Observer } from 'mobx-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SM } from '../../../../App';
import { ReactComponent as NewTabIcon } from '../../../../assets/images/new_tab.svg';
import { documentRevisionsActions, documentRevisionsSelectors } from '../../../../state/ducks/documentRevisions';
import { DOCUMENT_REVISION_GET_ASYNC_DRAWER } from '../../../../state/ducks/documentRevisions/constants';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../../../state/reducers';
import { AsyncStatus } from '../../../../state/types';
import AsyncGate from '../../../components/AsyncGate';
import Text from '../../../components/Text';
import { documentVersionPath } from '../../../document.revision/utils/paths';
import DocumentRevisionUpdateContainer from '../../../documentRevision/DocumentRevisionUpdate.container';
import useActionCreator from '../../../hooks/useActionCreator';
import { DialogHandler } from '../../../hooks/useDialog';
import Theme from '../../../layout/theme/provider';
import { styles } from './DocumentRevisionDialog.styles';

interface DocumentRevisionDialogProps {
  dialog: DialogHandler
  docRevId?: string
  woRevId?: string
}

const DocumentRevisionDialog: React.FC<
DocumentRevisionDialogProps
> = ({ dialog, docRevId, woRevId }) => {
  const classes = styles();
  const { _documentRevisionFormState } = SM.useStores();
  const dispatch = useDispatch();

  const loadDocumentRevision = useActionCreator(documentRevisionsActions.load);
  const loadAction = () => loadDocumentRevision(docRevId, DOCUMENT_REVISION_GET_ASYNC_DRAWER);

  const loadDocumentRevisionAsyncState = useSelector(
    documentRevisionsSelectors.getLoadAsyncDrawerState,
  );

  const documentRevision = useSelector((state: ApplicationState) => {
    return (
      docRevId
        && documentRevisionsSelectors.getDocumentRevision(state, docRevId)
    );
  });

  const handleOpenNewTab = () => {
    const newDocumentRevision = (documentRevision ?? _documentRevisionFormState?.newlyCreatedDocumentRevision) as DocumentRevision;
    const path = documentVersionPath(newDocumentRevision?.id || '', newDocumentRevision?.document?.id || '');
    window.open(path);
  };

  const handleCloseDialog = () => {
    dialog.close();
    woRevId && dispatch(documentRevisionsActions.reload(woRevId));
  };

  return (
    <Dialog
      disableBackdropClick={true}
      disableEnforceFocus
      classes={{
        root: classes.root,
        paper: classes.paper,
      }}
      scroll="paper"
      disableEscapeKeyDown={true}
      maxWidth={false}
      open={dialog.isOpen}
      onSubmit={(event: React.FormEvent) => event.stopPropagation()}
      id="DocumentRevision-dialog"
    >
      <DialogTitle className={classes.title} disableTypography>
        <Typography className={classes.heading}>
          <Text translation="bom.documentRevision.dialog.title" />
        </Typography>
        <IconButton
          className={classes.close}
          size="small"
          onClick={handleOpenNewTab}
        >
          <NewTabIcon />
        </IconButton>
        <IconButton
          className={classes.close}
          size="small"
          onClick={handleCloseDialog}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers
        id="DocumentRevision-content"
      >
        <Observer>
          {() => (
            <>
              <AsyncGate
                asyncAction={loadAction}
                startActionOnMount
                asyncState={docRevId ? loadDocumentRevisionAsyncState : (_documentRevisionFormState?.newlyCreatedDocumentRevision ? { status: AsyncStatus.Success } : { status: '' })}
              >
                {(_documentRevisionFormState?.newlyCreatedDocumentRevision || documentRevision) && (
                  <Theme>
                    <DocumentRevisionUpdateContainer
                      documentRevision={(documentRevision ?? _documentRevisionFormState?.newlyCreatedDocumentRevision) as DocumentRevision}
                      documentId={(docRevId ? (documentRevision as DocumentRevision)?.documentId : _documentRevisionFormState?.documentId) as string}
                      canChangeOwnerShip={false}
                      isNewVersion={false}
                    />
                  </Theme>
                )}
              </AsyncGate>
            </>
          )}
        </Observer>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentRevisionDialog;
