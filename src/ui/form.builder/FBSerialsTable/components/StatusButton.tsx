import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { translate } from '../../../../common/intl';
import { Button } from '../../../components/forms/fields-next';
import { Colors } from '../../../layout/theme-next';

export enum StatusButtonType {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
}

interface StatusButtonProps {
  isSelected?: boolean
  isDisabled?: boolean
  type: StatusButtonType
  onClick: () => void
}

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: theme.shape.borderRadius,
    color: Colors.textBlack,
    borderColor: Colors.stroke,
    fontWeight: 400,
    fontSize: 12,
    padding: theme.spacing(0.5, 1, 0.5, 1.5),

    '&:hover': {
      borderColor: Colors.stroke,
    },
  },
  selected: {
    color: Colors.white,
  },
  rejected: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
  accepted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  icon: {
    fontSize: '12px !important',
  },
}));

const StatusButton: React.FC<StatusButtonProps> = ({
  isSelected = false,
  isDisabled = false,
  type,
  onClick,
}) => {
  const classes = useStyles();

  const text = type === StatusButtonType.ACCEPT
    ? translate('form.builder.serials.accept')
    : translate('form.builder.serials.reject');
  const icon = type === StatusButtonType.ACCEPT ? solid('check') : solid('xmark');

  return (
    <Button
      kind="outlined"
      size="small"
      onClick={onClick}
      disabled={isDisabled}
      startIcon={<FontAwesomeIcon icon={icon} className={classes.icon} />}
      className={cx(
        classes.root,
        {
          [classes.selected]: isSelected,
          [classes.accepted]: isSelected && type === StatusButtonType.ACCEPT,
          [classes.rejected]: isSelected && type === StatusButtonType.REJECT,
        },
      )}
    >
      {text}
    </Button>
  );
};

export default StatusButton;
