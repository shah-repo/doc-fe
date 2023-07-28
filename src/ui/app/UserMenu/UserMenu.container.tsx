import React from 'react';
import { useLocation } from 'react-router-dom';
import { Nullable } from '../../../state/ducks/common/types';
import UserMenuPresenter from './UserMenu.presenter';

interface Props {
  anchorEl: Nullable<HTMLElement>
  handleCloseMenu: () => void
  open?: boolean
}

const UserMenuContainer: React.FunctionComponent<Props> = ({
  anchorEl,
  handleCloseMenu,
  open,
}) => {
  const location = useLocation();

  return (
    <UserMenuPresenter
      {...{
        location,
        anchorEl,
        handleCloseMenu,
        open,
      }}
    />
  );
};

export default UserMenuContainer;
