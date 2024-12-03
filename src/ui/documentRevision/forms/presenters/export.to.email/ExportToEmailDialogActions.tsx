import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { Button } from '../../../../components/forms/fields-next';
import Text from '../../../../components/Text';
import { Dialog } from '../../../../hooks/useDialog';
import { styles } from './ExportToEmailModal.styles';

interface ExportToEmailDialogActionsProps {
  emailDialog: Dialog
  handleEmail: () => void
  isLoading: boolean
  isNoOptionSelected?: boolean
}

const ExportToEmailDialogActions: React.FC<ExportToEmailDialogActionsProps> = ({
  isLoading,
  isNoOptionSelected,
  emailDialog,
  handleEmail,
}) => {
  const classes = styles();

  return (
    <Box className={classes.container}>
      <Box className={classes.noteContainer} data-cy="note-container">
        <Typography variant="h2" component="h2" className={classes.additionalText}>
          <strong className={classes.contentNote}>{translate('share.download.popup.note')}</strong> <br />
          <strong className={classes.contentNote}>{translate('share.download.popup.small.files')}</strong> {translate('share.download.popup.small.files.message')}
          <br />
          <strong className={classes.contentNote}>{translate('share.download.popup.large.files')}</strong> {translate('share.download.popup.large.files.message')}
          <br />
          <span className={classes.additionalText}>
            {translate('share.download.popup.note.message')}
          </span>
        </Typography>
      </Box>
      <br />
      <Box display="flex" justifyContent="flex-end" alignItems="center" width="100%">
        {isLoading ? (
          <Box className={classes.loader} data-cy="download-message">
            <FontAwesomeIcon className={classes.spinner} icon={regular('loader')} size="lg" />
            <Text translation="share.download.message" />
          </Box>
        ) : (
          <>
            <Button variant="text" onClick={emailDialog.close} data-cy="cancel">
              <Text translation="common.cancel" />
            </Button>
            <Button
              disabled={isNoOptionSelected}
              variant="contained"
              onClick={handleEmail}
              data-cy="confirm"
            >
              <Text translation="common.confirm" />
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ExportToEmailDialogActions;
