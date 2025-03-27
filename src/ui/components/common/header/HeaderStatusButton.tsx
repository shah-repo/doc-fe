import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, ButtonProps, ListItemText, MenuItem } from '@material-ui/core';
import { kebabCase } from 'lodash';
import React from 'react';
import {
  EquipmentStatus,
  LotStatus,
} from '../../../../state/ducks/documentRevisions/types';
import { MAX_ASL_STATUS_CHAR_LIMIT } from '../../../form.builder/FBProductOrService/constants';
import useMenu from '../../../hooks/useMenu';
import { Button, SplitButtonMenu } from '../../forms/fields-next';
import OverflowTooltip from '../../OverflowTooltip';
import useStyles from './HeaderStatusButton.styles';
import { truncateByMaxChars } from './Helpers';

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
  const Icon = (
    <Box className={classes.buttonIcon}>
      <FontAwesomeIcon icon={solid('chevron-down')} />
    </Box>
  );

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
        <OverflowTooltip arrow placement="top" title={label} wrapperClassName={classes.buttonLabel}>
          {truncateByMaxChars(label, MAX_ASL_STATUS_CHAR_LIMIT)}
        </OverflowTooltip>
      </Button>
      {!disabled && (
        <SplitButtonMenu
          anchorEl={optionsMenu.anchor}
          onClose={optionsMenu.close}
          MenuListProps={{
            ['data-cy' as string]: `${dataCy}-menu`,
          }}
        >
          {options.map((option: StatusOption) => (
            <MenuItem
              key={option.value}
              onClick={handleMenuClick(option.value)}
              data-cy={`${kebabCase(option.value)}-option`}
              className={classes.menuItem}
            >
              <ListItemText className={classes.menuItemText}>
                <OverflowTooltip arrow placement="top" title={label}>
                  {truncateByMaxChars(option.label, MAX_ASL_STATUS_CHAR_LIMIT)}
                </OverflowTooltip>
              </ListItemText>
            </MenuItem>
          ))}
        </SplitButtonMenu>
      )}
    </>
  );
};

export default HeaderStatusButton;
