import { useObserver } from "mobx-react";
import React from "react";
import { FB } from "..";
import useDialog from "../../hooks/useDialog";
import FBReceivePODialog from "./FBReceivePODialog";
import FBReceivePOTablePresenter from "./FBReceivePOTable.presenter";


const FBReceivePOTableContainer: React.FunctionComponent<any> = ({
  ...props
}) => {
  const dialog = useDialog();
  const { receiveState } = FB.useStores();
  useObserver(() => receiveState?.items);
  const handleEdit = (index, item) => () => {
    dialog.open();
    console.log(index);
    console.log(item);
  };
  const closeDialog = () => {
    dialog.close();
    receiveState?.clearFormValues();
  };
  const onSubmit = (values) => {
    console.log(values);
    closeDialog();
  };

  if (receiveState?.items.length === 0) {
    return null;
  }

  return (
    <>
      <FBReceivePOTablePresenter
        {...props}
        items={receiveState?.items}
        handleEdit={handleEdit}
      />
      <FBReceivePODialog
        {...props}
        closeDialog={closeDialog}
        onSubmit={onSubmit}
        isDialogOpen={dialog.isOpen}
      />
    </>
  );
};

export default FBReceivePOTableContainer;
