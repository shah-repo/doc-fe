import { Button } from '@material-ui/core';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { StyledButton } from '../../../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListIcon } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon';
import { StyledMenuListItem } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import SM from '../../../../../App/Shifamed/Utils/SM/SM';
import { ReactComponent as SendToEmail } from '../../../../../assets/images/send_to_email.svg';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { Dialog } from '../../../../components/dialogs';
import { toastError, toastSuccess } from '../../../../components/notifications';
import Text from '../../../../components/Text';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import ExportToEmailModal from './ExportToEmailModal';
interface Props {
  revisionId: string
  canAccess: boolean
  renderAsButton?: boolean
}

const ExportToEmail: React.FunctionComponent<Props> = ({ revisionId, canAccess, renderAsButton }) => {
  const isNewLayout = SM.isNewLayout;
  const intl = useIntl();
  const emailDialog = useDialog();
  const [value, setValue] = React.useState(false);

  const handleChange = (event) => {
    setValue(event.target.value === 'true');
  };

  const async = useAsync({
    onSuccess: () => {
      emailDialog.close();
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

  const runExport = () => {
    async.start(exportToEmail, revisionId, { includeAuditLogs: value }, async);
  };

  const getUpdatedButton = () => {
    if (isNewLayout) {
      if (!renderAsButton) {
        return (
          <StyledMenuListItem button alignItems="flex-start" onClick={emailDialog.open}>
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
          onClick={emailDialog.open}
        >
          <Text translation="common.send.to.email" />
        </StyledButton>
      );
    }

    return (
      <>
        <Button data-cy="exportToEmail" variant="outlined" color="secondary" onClick={emailDialog.open}>
          <Text translation="common.send.to.email" />
        </Button>
      </>
    );
  };

  return (
    <>
      {getUpdatedButton()}
      <Dialog
        title="common.send.to.email"
        open={emailDialog.isOpen}
        loading={async.isLoading}
        confirmLabel="common.confirm"
        cancelLabel="common.cancel"
        onClose={emailDialog.close}
        onConfirm={runExport}
      >
        <ExportToEmailModal
          {...{ value, handleChange }}
        />
      </Dialog>
    </>
  );
};

export default ExportToEmail;
