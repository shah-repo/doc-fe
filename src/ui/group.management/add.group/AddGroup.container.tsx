import React from 'react';
import { GetEmployeeResponse } from '../../../state/ducks/userManagement/types';
import useDialog from '../../hooks/useDialog';
import AddGroupPresenter from './AddGroup.presenter';

interface Props {
  addGroup?: () => void
  activeEmployees?: GetEmployeeResponse[]
}
const AddGroupContainer: React.FunctionComponent <Props> = ({ addGroup, activeEmployees }) => {
  const dialog = useDialog();
  const openDialog = () => {
    addGroup && addGroup();
    // dialog.open();
  };
  const closeDialog = () => dialog.close();

  return (
    <AddGroupPresenter
      openDialog={openDialog}
      closeDialog={closeDialog}
      isOpen={dialog.isOpen}
      activeEmployees={activeEmployees}
    />
  );
};

export default AddGroupContainer;
