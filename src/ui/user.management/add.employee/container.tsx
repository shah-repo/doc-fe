import React from 'react';
import useDialog from '../../hooks/useDialog';
import AddEmployeePresenter from './presenter';

interface Props {
  onAdd?: () => void
}
const AddEmployeeContainer: React.FunctionComponent<Props> = ({ onAdd }) => {
  const dialog = useDialog();
  const openDialog = () => onAdd?.();
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
