import React from "react";
import useDialog from "../../hooks/useDialog";
import AddGroupPresenter from "./AddGroup.presenter";

const AddGroupContainer: React.FunctionComponent = () => {
  const dialog = useDialog();
  const openDialog = () => dialog.open();
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
