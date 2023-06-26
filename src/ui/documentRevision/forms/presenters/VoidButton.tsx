import { Box, Button } from '@material-ui/core';
import React, { useMemo } from 'react';
import { StyledButton } from '../../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListIcon } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon';
import { StyledMenuListItem } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import SM from '../../../../App/Shifamed/Utils/SM/SM';
import { ReactComponent as VoidDocumentIcon } from '../../../../assets/images/void_document.svg';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import { AsyncStatus } from '../../../../state/types';
import AlertDialog from '../../../app/alert.dialog/AlertDialog';
import FormMessage from '../../../components/forms/FormMessage';
import FormProgress from '../../../components/forms/FormProgress';
import Text from '../../../components/Text';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import { checkIsDocumentRecord } from '../../helpers/checkDocumentGroup';

interface Props {
  documentRevision: DocumentRevision | undefined
  renderAsButton?: boolean
}
const VoidButton: React.FunctionComponent<Props> = ({
  documentRevision,
  renderAsButton,
}) => {
  const isNewLayout = SM.isNewLayout;
  const dialog = useDialog();
  const async = useAsync();

  const isRecord = useMemo(() =>
    checkIsDocumentRecord(documentRevision?.document?.documentType?.groupOptions || []), [documentRevision]);

  const voidAction = useActionCreator(documentRevisionsActions.voidDocument);
  const voidDocument = () => {
    documentRevision
    && async.start(
      voidAction,
      documentRevision.id,
      async,
    );
  };

  return (
    <>
      <Box position="absolute" marginTop="-50px">
        <FormMessage asyncState={async.asyncState} />
        <FormProgress asyncState={async.asyncState} />
      </Box>
      {isNewLayout ? (
        renderAsButton ? <StyledButton
          color="primary" id="void-button"
          data-cy="void-button" onClick={dialog.open}
          disabled={async.asyncState.status === AsyncStatus.Active}>
          <Text translation="common.void" />
        </StyledButton> : <StyledMenuListItem
          button
          disabled={async.asyncState.status === AsyncStatus.Active}
          alignItems="flex-start"
          onClick={dialog.open}
        >
          <StyledMenuListIcon>
            <VoidDocumentIcon />
          </StyledMenuListIcon>
          <StyledMenuListItemText
            id="void-button"
            data-cy="void-button"
            primary={<Text translation="common.void" />}
          />
        </StyledMenuListItem>
      ) : (
        <Button
          id="void-button"
          data-cy="void-button"
          variant="outlined"
          color="secondary"
          onClick={dialog.open}
          disabled={async.asyncState.status === AsyncStatus.Active}
        >
          <Text translation="common.void" />
        </Button>
      )}
      <AlertDialog
        confirmAction={voidDocument}
        message={isRecord ? 'documentRevision.record.void.alert' : 'documentRevision.void.alert'}
        {...{ dialog }}
      />
    </>
  );
};

export default VoidButton;
