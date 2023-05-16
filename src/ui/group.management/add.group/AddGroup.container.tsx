import React from 'react';
import useDialog from '../../hooks/useDialog';
import AddGroupPresenter from './AddGroup.presenter';

interface Props {
  addGroup?: () => void;
}
const AddGroupContainer: React.FunctionComponent <Props> = ({ addGroup }) => {
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
    />
  );
};

export default AddGroupContainer;
