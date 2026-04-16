import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Theme, Tooltip } from '@material-ui/core';
import { ComponentsProps } from '@material-ui/core/styles/props';
import cx from 'classnames';
import React from 'react';
import useHover from '../../hooks/useHover';

const DeleteButton: React.FC<{ className?: string, onClick?: () => void }> = ({ className, onClick }) => {
  const [ref, isHovered] = useHover<HTMLSpanElement>();

  return (
    <Tooltip title="Remove" placement="top" arrow>
      <span className="chip-delete" onClick={onClick} ref={ref}>
        <FontAwesomeIcon className={cx(className, 'chip-delete-icon')} icon={isHovered ? solid('trash-can') : regular('trash-can')} />
      </span>
    </Tooltip>
  );
};

const props = (theme: Theme): ComponentsProps => ({
  MuiMenu: {
    elevation: 2,
    MenuListProps: {
      disablePadding: true,
    },
  },
  MuiDialog: {
    PaperProps: {
      elevation: 3,
    },
  },
  MuiDialogTitle: {
    disableTypography: true,
  },
  MuiButtonBase: {
    disableRipple: true,
  },
  MuiCheckbox: {
    disableRipple: true,
    color: 'default',
  },
  MuiRadio: {
    disableRipple: true,
    color: 'default',
  },
  MuiButton: {
    variant: 'contained',
    color: 'primary',
    // TODO uncomment after upgrading MUI
    // disableElevation: true,
  },
  MuiButtonGroup: {
    // TODO uncomment after upgrading MUI
    // disableElevation: true,
    disableRipple: true,
  },
  MuiInputBase: {
    fullWidth: true,
  },
  MuiChip: {
    deleteIcon: <DeleteButton />,
  },
  MuiSwitch: {
    color: 'default',
  },
});

export default props;
