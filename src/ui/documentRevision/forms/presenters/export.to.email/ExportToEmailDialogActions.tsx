import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, makeStyles } from '@material-ui/core';
import React from 'react';
import { Button } from '../../../../components/forms/fields-next';
import Text from '../../../../components/Text';
import { Dialog } from '../../../../hooks/useDialog';

const style = makeStyles((theme) => ({
  loader: {
    gap: theme.spacing(1.25),
  },
}));

interface ExportToEmailDialogActionsProps {
  emailDialog: Dialog
  handleEmail: () => void
  isLoading: boolean
  isNoOptionSelected?: boolean
}

const ExportToEmailDialogActions: React.FC<ExportToEmailDialogActionsProps> = ({ isLoading, isNoOptionSelected, emailDialog, handleEmail }) => {
  const classes = style();

  return (
    <>
      <Button kind="secondary" startIcon={<FontAwesomeIcon icon={regular('link')} data-cy="copy-link" />} ><Text translation="share.copy.link" /></Button>
      {isLoading
        ? <Box display="flex" className={classes.loader} ><FontAwesomeIcon icon={regular('loader')} size="lg" /><Text translation="share.downloading" /></Box>
        : <Box>
          <Button variant="text" onClick={emailDialog.close}><Text translation="common.cancel" /></Button>
          <Button disabled={isNoOptionSelected} variant="contained" onClick={handleEmail}><Text translation="common.confirm" /></Button>
        </Box>}
    </>
  );
};

export default ExportToEmailDialogActions;
