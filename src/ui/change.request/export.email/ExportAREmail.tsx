import * as React from 'react';
import { useIntl } from 'react-intl';
import { SM } from '../../../App';
import { StyledButton } from '../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListIcon } from '../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon';
import { StyledMenuListItem } from '../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import { ReactComponent as SendToEmail } from '../../../assets/images/send_to_email.svg';
import { changeRequestsActions } from '../../../state/ducks/changeRequest';
import { Dialog } from '../../components/dialogs';
import { Button } from '../../components/forms/fields-next';
import { toastError, toastSuccess } from '../../components/notifications';
import Text from '../../components/Text';
import ExportToEmailModal from '../../documentRevision/forms/presenters/export.to.email/ExportToEmailModal';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';

interface Props {
  id: string
  renderAsButton?: boolean
}

const ExportARToEmail: React.FunctionComponent<Props> = ({
  id, renderAsButton,
}) => {
  const intl = useIntl();
  const emailDialog = useDialog();
  const [value, setValue] = React.useState(false);
  const handleChange = (event) => {
    setValue(event.target.value === 'true');
  };
  const exportTrainingRecordEmail = useActionCreator(changeRequestsActions.exportAR);
  const isNewLayout = SM.isNewCRLayout || SM.isNewLayout;
  const async = useAsync({
    onSuccess: () => {
      emailDialog.close();
      toastSuccess(intl.formatMessage({ id: 'common.send.to.email.success' }));
    },
    onError: () => {
      toastError(intl.formatMessage({ id: 'common.send.to.email.error' }));
    },
  });

  const handleAREmail = () => {
    async.start(exportTrainingRecordEmail, id, { includeAuditLogs: value }, async);
  };

  const getUpdatedButton = () => {
    if (isNewLayout) {
      if (!renderAsButton) {
        return (<StyledMenuListItem button alignItems="flex-start" onClick={emailDialog.open}>
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
          style={{ margin: 0 }}
          data-cy="exportToEmail"
          onClick={emailDialog.open}
        >
          <Text translation="common.send.to.email" />
        </StyledButton>
      );
    }

    return (
      <Button
        kind="white"
        data-cy="exportToEmail"
        onClick={emailDialog.open}
      >
        <Text translation="common.send.to.email" />
      </Button>
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
        onConfirm={handleAREmail}
      >
        <ExportToEmailModal
          {...{ value, handleChange }}
        />
      </Dialog>
    </>
  );
};

export default ExportARToEmail;
