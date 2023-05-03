import { Button, Modal } from '@material-ui/core';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { StyledButton } from '../../../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListIcon } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon';
import { StyledMenuListItem } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import SM from '../../../../../App/Shifamed/Utils/SM/SM';
import { ReactComponent as SendToEmail } from '../../../../../assets/images/send_to_email.svg';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { toastError, toastSuccess } from '../../../../components/notifications';
import Text from '../../../../components/Text';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import ExportToEmailModal from './ExportToEmailModal';
import { styles } from './ExportToEmailModal.styles';

interface Props {
  revisionId: string
  canAccess: boolean
  renderAsButton?: boolean
}

const ExportToEmail: React.FunctionComponent<Props> = ({ revisionId, canAccess, renderAsButton }) => {
  const isNewLayout = SM.isNewLayout;
  const intl = useIntl();
  const classes = styles();
  const [cloneModelopen, setCloneModelopen] = React.useState(false);
  const openCloneModel = (e) => {
    e.stopPropagation();
    setCloneModelopen(true);
  };

  const handleCloneModelClose = () => {
    setCloneModelopen(false);
  };

  const onClose = () => {
    handleCloneModelClose();
  };
  const async = useAsync({
    onSuccess: () => {
      toastSuccess(intl.formatMessage({ id: 'common.send.to.email.success' }));
    },
    onError: () => {
      if (!canAccess) {
        toastError(intl.formatMessage({ id: 'common.send.to.email.no.access' }));
        return;
      }
      toastError(intl.formatMessage({ id: 'common.send.to.email.error' }));
    },
  });

  const exportToEmail = useActionCreator(documentRevisionsActions.exportToEmail);

  const handleClick = (payload) => {
    handleCloneModelClose();
    async.start(exportToEmail, revisionId, { ...payload }, async);
  };

  const getUpdatedButton = () => {
    if (isNewLayout) {
      if (!renderAsButton) {
        return (
          <StyledMenuListItem button alignItems="flex-start" onClick={openCloneModel}>
            <StyledMenuListIcon><SendToEmail /></StyledMenuListIcon>
            <StyledMenuListItemText
              data-cy="exportToEmail"
              primary={<Text translation="common.send.to.email" />}
            />
          </StyledMenuListItem>
        );
      }
      return (
        <StyledButton
          color="primary"
          data-cy="exportToEmail"
          onClick={openCloneModel}
        >
          <Text translation="common.send.to.email" />
        </StyledButton>
      );
    }

    return (
      <>
        <Button data-cy="exportToEmail" variant="outlined" color="secondary" onClick={openCloneModel}>
          <Text translation="common.send.to.email" />
        </Button>
      </>
    );
  };

  return (
    <>
      {getUpdatedButton()}
      <Modal open={cloneModelopen} onClose={onClose} className={classes.modal}>
        <ExportToEmailModal
          handleCloneModelClose={onClose}
          action={handleClick}
        />
      </Modal>
    </>
  );
};

export default ExportToEmail;
