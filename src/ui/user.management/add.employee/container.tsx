import React from "react";
import useDialog from "../../hooks/useDialog";
import AddEmployeePresenter from "./presenter";

const AddEmployeeContainer: React.FunctionComponent = () => {
  const dialog = useDialog();
  const openDialog = () => dialog.open();
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
