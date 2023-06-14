import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Theme } from '@material-ui/core';
import { ComponentsProps } from '@material-ui/core/styles/props';
import cx from 'classnames';
import React from 'react';

const DeleteButton: React.FC<{ className?: string, onClick?: () => void }> = ({ className, onClick }) => (
  <span className="chip-delete" onClick={onClick}>
    <FontAwesomeIcon className={cx(className, 'chip-delete-icon')} icon={regular('trash-can')} />
  </span>
);

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
});

export default props;
