import { Box, Button } from '@material-ui/core';
import React from 'react';
import { StyledButton } from '../../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListItemText } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import { StyledMenuListIcon } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon';
import { StyledMenuListItem } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import SM from '../../../../App/Shifamed/Utils/SM/SM';
import { ReactComponent as VoidDocumentIcon } from '../../../../assets/images/void_document.svg';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import { AsyncStatus } from '../../../../state/types';
import VoidAlertDialog from '../../../app/alert.dialog/VoidAlertDialog';
import Text from '../../../components/Text';
import FormMessage from '../../../components/forms/FormMessage';
import FormProgress from '../../../components/forms/FormProgress';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';

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
      <VoidAlertDialog
        async={async}
        dialog={dialog}
        documentRevision={documentRevision}
      />
    </>
  );
};

export default VoidButton;
