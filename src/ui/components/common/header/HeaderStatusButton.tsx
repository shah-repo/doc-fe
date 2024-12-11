import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, ButtonProps, ListItemText, MenuItem } from '@material-ui/core';
import { kebabCase } from 'lodash';
import React from 'react';
import { EquipmentStatus, LotStatus } from '../../../../state/ducks/documentRevisions/types';
import useMenu from '../../../hooks/useMenu';
import { Button, SplitButtonMenu } from '../../forms/fields-next';
import useStyles from './HeaderStatusButton.styles';

export type StatusValue = LotStatus | EquipmentStatus | string;

interface StatusOption {
  value: StatusValue
  label: string
}

interface HeaderStatusButtonProps extends ButtonProps {
  label: string
  options: StatusOption[]
  onItemSelect: (value: StatusValue) => void
}

const HeaderStatusButton: React.FC<HeaderStatusButtonProps> = ({
  label,
  options,
  disabled,
  onItemSelect,
  ...props
}) => {
  const optionsMenu = useMenu();
  const classes = useStyles();
  const dataCy = props['data-cy'] ?? 'status';

  const handleMenuClick = (value: StatusValue) => () => onItemSelect(value);

  const Icon = <Box className={classes.buttonIcon}><FontAwesomeIcon icon={solid('chevron-down')} /></Box>;

  return (
    <>
      <Button
        {...props}
        disabled={disabled}
        className={classes.button}
        kind="white"
        endIcon={!disabled ? Icon : undefined}
        onClick={!disabled ? optionsMenu.open : undefined}
        data-cy={`${dataCy}-button`}
      >
        {label}
      </Button>
      {!disabled && (
        <SplitButtonMenu
          anchorEl={optionsMenu.anchor}
          onClose={optionsMenu.close}
          MenuListProps={{
            ['data-cy' as string]: `${dataCy}-menu`,
          }}
        >
          {options.map(option => (
            <MenuItem
              key={option.value}
              onClick={handleMenuClick(option.value)}
              data-cy={`${kebabCase(option.value)}-option`}
            >
              <ListItemText>{option.label}</ListItemText>
            </MenuItem>
          ))}
        </SplitButtonMenu>
      )}
    </>
  );
};

export default HeaderStatusButton;
