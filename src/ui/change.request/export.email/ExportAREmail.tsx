import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, makeStyles, Typography } from '@material-ui/core';
import * as React from 'react';
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
import Text from '../../components/Text';
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
    justifyContent: 'space-between',
  },
  loader: {
    gap: '10px',
  },
}));

const ExportARToEmail: React.FunctionComponent<Props> = ({
  id, renderAsButton,
}) => {
  const intl = useIntl();
  const classes = style();
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
      toastSuccess(
        <Box>
          <Typography
            variant="h2"
            component="h2"
          >
            <Text translation="share.downloading.started.popup.title" />
          </Typography>
          {intl.formatMessage({ id: 'share.downloading.popup.desc' })}
        </Box>,
        { autoClose: 15000000 });
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
        actions={ <>
          <Button kind="secondary" startIcon={<FontAwesomeIcon icon={regular('link')} data-cy="copy-link" />} ><Text translation="share.copy.link" /></Button>
          {async.isLoading
            ? <Box display="flex" className={classes.loader} ><FontAwesomeIcon icon={regular('loader')} size="lg" /><Text translation="share.downloading" /></Box>
            : <Box>
              <Button variant="text" onClick={emailDialog.close}><Text translation="common.cancel" /></Button>
              <Button variant="contained" onClick={handleAREmail}><Text translation="common.confirm" /></Button>
            </Box>}
        </>}
        actionsProps={{ className: classes.dialogAction }}
      >
        <ExportToEmailModal
          {...{ value, handleChange }}
        />
      </Dialog>
    </>
  );
};

export default ExportARToEmail;
