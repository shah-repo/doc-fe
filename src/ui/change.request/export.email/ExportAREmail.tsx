import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core';
import { omit } from 'lodash';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { SM } from '../../../App';
import { StyledButton } from '../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListIcon } from '../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon';
import { StyledMenuListItem } from '../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import { changeRequestsActions } from '../../../state/ducks/changeRequest';
import { Dialog } from '../../components/dialogs';
import { Button } from '../../components/forms/fields-next';
import { toastError, toastSuccess } from '../../components/notifications';
import { ExportPDFToastr } from '../../components/notifications/ExportPDFToastr';
import { exportPDFToastrStyles } from '../../components/notifications/ExportPDFToastr.styles';
import Text from '../../components/Text';
import ExportToEmailDialogActions from '../../documentRevision/forms/presenters/export.to.email/ExportToEmailDialogActions';
import ExportToEmailModal from '../../documentRevision/forms/presenters/export.to.email/ExportToEmailModal';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';

interface Props {
  id: string
  renderAsButton?: boolean
}

const style = makeStyles((theme) => ({
  dialogAction: {
    justifyContent: 'flex-end',
  },
}));

const ExportARToEmail: React.FunctionComponent<Props> = ({
  id, renderAsButton,
}) => {
  const intl = useIntl();
  const classes = style();
  const pdfToastrStyles = exportPDFToastrStyles();
  const emailDialog = useDialog();
  const [value, setValue] = useState(false);
  const [isNoOptionSelected, setNoOptionSelected] = useState(false);
  const handleChange = (event) => {
    setValue(event.target.value === 'true');
  };
  const exportTrainingRecordEmail = useActionCreator(changeRequestsActions.exportAR);
  const isNewLayout = SM.isNewCRLayout || SM.isNewLayout;
  const async = useAsync({
    onSuccess: () => {
      emailDialog.close();
      toastSuccess(<ExportPDFToastr />, {
        className: pdfToastrStyles.popup,
        bodyClassName: pdfToastrStyles.popupBody,
        progressClassName: 'progressClassName',
      });
    },
    onError: () => {
      toastError(intl.formatMessage({ id: 'common.send.to.email.error' }));
    },
  });
  const childFormRef = useRef();

  const handleAREmail = () => {
    if (childFormRef.current) {
      const values = omit(childFormRef.current.getValues(), 'includeDate');
      async.start(
        exportTrainingRecordEmail,
        id,
        { ...values, includeAuditLogs: Boolean(values?.includeAuditLogs) },
        async,
      );
    }
  };

  const getUpdatedButton = () => {
    if (isNewLayout) {
      if (!renderAsButton) {
        return (<StyledMenuListItem button alignItems="flex-start" onClick={emailDialog.open}>
          <StyledMenuListIcon><FontAwesomeIcon icon={regular('share')} size="lg" /></StyledMenuListIcon>
          <StyledMenuListItemText
            data-cy="export-to-email"
            primary={<Text translation="common.share" />}
          />
        </StyledMenuListItem>
        );
      }
      return (
        <StyledButton
          color="primary"
          style={{ margin: 0 }}
          data-cy="export-to-email"
          onClick={emailDialog.open}
        >
          <Text translation="common.send.to.email" />
        </StyledButton>
      );
    }

    return (
      <Button
        kind="white"
        data-cy="export-to-email"
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
        title="common.share"
        open={emailDialog.isOpen}
        loading={async.isLoading}
        onClose={emailDialog.close}
        actions={ <ExportToEmailDialogActions {...{ handleEmail: handleAREmail, emailDialog, isLoading: async.isLoading, isNoOptionSelected }} />}
        actionsProps={{ className: classes.dialogAction }}
      >
        <ExportToEmailModal
          ref={childFormRef}
          {...{ value, handleChange, setNoOptionSelected, isNoOptionSelected, arId: id }}
        />
      </Dialog>
    </>
  );
};

export default ExportARToEmail;
