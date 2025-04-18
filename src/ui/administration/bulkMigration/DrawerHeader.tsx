import { light, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppBar, Toolbar, Tooltip, Typography } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../common/intl';
import { IconButton } from '../../components/forms/fields-next';
import useHover from '../../hooks/useHover';
import useStyles from './styles';

interface DialogHeaderProps {
  title: string
  onDialogClose: () => void
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ title, onDialogClose }) => {
  const classes = useStyles();
  const [discardRef, isDiscardHovered] = useHover<HTMLButtonElement>();

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography variant="h6" className={classes.rulesTitle} style={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Tooltip title={translate('common.close')} placement="top" arrow>
          <IconButton
            kind="simple"
            color="primary"
            ref={discardRef}
            onClick={onDialogClose}
            iconSize={22}
            data-cy="dialog-header"
          >
            <FontAwesomeIcon icon={isDiscardHovered ? solid('square-xmark') : light('square-xmark')} />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default DialogHeader;
