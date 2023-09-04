import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Observer } from 'mobx-react';
import React from 'react';
import { SM } from '../../../../App';
import { ReactComponent as NewTabIcon } from '../../../../assets/images/new_tab.svg';
import { TabTypeOptions } from '../../../../state/ducks/documentRevisions/documentType/types';
import { AsyncStatus } from '../../../../state/types';
import AsyncGate from '../../../components/AsyncGate';
import Text from '../../../components/Text';
import { documentVersionPath } from '../../../document.revision/utils/paths';
import DocumentRevisionUpdateContainer from '../../../documentRevision/DocumentRevisionUpdate.container';
import { DialogHandler } from '../../../hooks/useDialog';
import Theme from '../../../layout/theme/provider';
import { styles } from './treelist/column.templates/styles';

interface DocumentRevisionDialogProps {
  dialog: DialogHandler
}

const DocumentRevisionDialog: React.FC<
DocumentRevisionDialogProps
> = ({ dialog }) => {
  const classes = styles();
  const { _documentRevisionFormState, _tabsState } = SM.useStores();

  const handleOpenNewTab = () => {
    const documentRevision = _documentRevisionFormState?.newlyCreatedDocumentRevision;
    const path = documentVersionPath(documentRevision?.id || '', documentRevision?.document?.id || '');
    window.open(path);
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
      <DialogTitle style={{ display: 'flex' }} disableTypography>
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
          onClick={dialog.close}
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
                asyncState={_documentRevisionFormState?.newlyCreatedDocumentRevision ? { status: AsyncStatus.Success } : { status: '' }}
              >
                {_documentRevisionFormState?.newlyCreatedDocumentRevision && (
                  <Theme>
                    <DocumentRevisionUpdateContainer
                      documentRevision={_documentRevisionFormState?.newlyCreatedDocumentRevision}
                      documentId={_documentRevisionFormState?.documentId as string}
                      canChangeOwnerShip={false}
                      isNewVersion={false}
                      minimizeRightPanel={_tabsState?.isTabActive(TabTypeOptions.BOM)}
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
