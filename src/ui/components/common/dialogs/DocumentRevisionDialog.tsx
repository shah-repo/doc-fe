import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as NewTabIcon } from '../../../../assets/images/new_tab.svg';
import { documentRevisionsActions, documentRevisionsSelectors } from '../../../../state/ducks/documentRevisions';
import { DOCUMENT_REVISION_GET_ASYNC_DRAWER } from '../../../../state/ducks/documentRevisions/constants';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../../../state/reducers';
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
  parentRevId?: string
}

const DocumentRevisionDialog: React.FC<
DocumentRevisionDialogProps
> = ({ dialog, docRevId, parentRevId }) => {
  const classes = styles();
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
    const path = documentVersionPath((documentRevision as DocumentRevision)?.id || '', (documentRevision as DocumentRevision)?.document?.id || '');
    window.open(path);
  };

  const handleCloseDialog = () => {
    dialog.close();
    parentRevId && dispatch(documentRevisionsActions.reload(parentRevId));
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
        <AsyncGate
          asyncAction={loadAction}
          startActionOnMount={Boolean(docRevId)}
          asyncState={loadDocumentRevisionAsyncState}
        >
          {documentRevision && (
            <Theme>
              <DocumentRevisionUpdateContainer
                documentRevision={documentRevision }
                documentId={((documentRevision)?.documentId) as string}
                canChangeOwnerShip={false}
                isNewVersion={false}
                inDialog={true}
              />
            </Theme>
          )}
        </AsyncGate>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentRevisionDialog;
