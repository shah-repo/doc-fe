import { Button } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { StyledButton } from '../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListIcon } from '../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon';
import { StyledMenuListItem } from '../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import SM from '../../../App/Shifamed/Utils/SM/SM';
import { ReactComponent as CloneIcon } from '../../../assets/images/clone.svg';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DOCUMENT_NUMBERING_STYLE } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import Text from '../../components/Text';
import { documentVersionPath } from '../../document.revision/utils/paths';
import CustomIdDialog from '../../documentRevision/dialogs/CustomIdDialog';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';
import { toastError } from '../notifications';

interface ClonePOButtonProps extends ButtonProps {
  documentRevision: DocumentRevision
  renderAsButton?: boolean
}

const ClonePOButton: React.FunctionComponent<ClonePOButtonProps> = ({
  documentRevision, renderAsButton,
}) => {
  const isNewLayout = SM.isNewLayout;

  const customIdDialog = useDialog();
  const documentType = documentRevision?.document.documentType;
  const isInternalTypeNumbering = documentType?.numberingStyle === DOCUMENT_NUMBERING_STYLE.INTERNAL;

  const clonePO = useActionCreator(documentRevisionsActions.cloneDoc);
  const history = useHistory();

  const asyncClone = useAsync({
    onSuccess: (documentRevision: any) => {
      history.push({
        pathname: documentVersionPath(
          documentRevision.id,
          documentRevision.document.id,
        ),
      });
    },
    onError: toastError,
  });

  const cloneAction = () => {
    if (!isInternalTypeNumbering) {
      customIdDialog.open();
    } else {
      asyncClone.start(clonePO, documentRevision.id, null, asyncClone);
    }
  };

  const handleCreateDocument = (docId: string) => {
    asyncClone.start(clonePO, documentRevision.id, { docId }, asyncClone);
  };

  const getUpdatedButton = () => {
    if (isNewLayout) {
      if (!renderAsButton) {
        return (<StyledMenuListItem button alignItems="flex-start" onClick={cloneAction}>
          <StyledMenuListIcon><CloneIcon /></StyledMenuListIcon>
          <StyledMenuListItemText
            data-cy="CloneEBButton"
            primary={<Text translation="documentRevision.clone" />}
          />
        </StyledMenuListItem>);
      }
      return (
        <StyledButton
          color="primary"
          data-cy="CloneEBButton"
          onClick={cloneAction}
        >
          <Text translation="documentRevision.clone" />
        </StyledButton>
      );
    }
    return (<Button
      variant="contained"
      color="secondary"
      data-cy="CloneEBButton"
      onClick={cloneAction}
    >
      <Text translation="documentRevision.clone" />
    </Button>);
  };

  return (
    <>
      {getUpdatedButton()}
      {customIdDialog.isOpen && <CustomIdDialog
        isOpen = {customIdDialog.isOpen}
        closeDialog = {customIdDialog.close}
        outputDocumentType = {documentType}
        isInternalTypeNumbering = {isInternalTypeNumbering}
        handleSubmit = {(docId: string) => handleCreateDocument(docId)}
      />}
    </>
  );
};

export default ClonePOButton;
