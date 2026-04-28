import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import React from 'react';
import { translate } from '../../../../common/intl';
import { Button } from '../../../components/forms/fields-next';
import { useStatusButtonStyles } from '../styles';

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

const StatusButton: React.FC<StatusButtonProps> = ({
  isSelected = false,
  isDisabled = false,
  type,
  onClick,
}) => {
  const classes = useStatusButtonStyles();

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
