import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppBar, LinearProgress, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { IconButton } from '../../components/forms/fields-next';
import useStyles from './styles';

interface DialogHeaderProps {
  title: string
  isLoading?: boolean
  onDialogClose?: () => void
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ title, onDialogClose, isLoading = false }) => {
  const classes = useStyles();

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography variant="h6" className={classes.rulesTitle}>
          {title}
        </Typography>
        {onDialogClose && (
          <IconButton kind="action" onClick={onDialogClose} data-cy="dialog-header">
            <FontAwesomeIcon icon={regular('xmark')} />
          </IconButton>
        )}
      </Toolbar>
      {isLoading && <LinearProgress />}
    </AppBar>
  );
};

export default DialogHeader;
