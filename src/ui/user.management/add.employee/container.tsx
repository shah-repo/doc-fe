import React from 'react';
import useDialog from '../../hooks/useDialog';
import AddEmployeePresenter from './presenter';

interface Props {
  addGroup?: () => void;
}
const AddEmployeeContainer: React.FunctionComponent<Props> = ({ addGroup }) => {
  const dialog = useDialog();
  const openDialog = () => addGroup && addGroup(); // dialog.open();
  const closeDialog = () => dialog.close();

  return (
    <AddEmployeePresenter
      openDialog={openDialog}
      closeDialog={closeDialog}
      isOpen={dialog.isOpen}
    />
  );
};

export default AddEmployeeContainer;
