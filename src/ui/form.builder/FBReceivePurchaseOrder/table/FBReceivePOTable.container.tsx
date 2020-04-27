import { useObserver } from "mobx-react";
import React from "react";
import { FB } from "../..";
import useDialog from "../../../hooks/useDialog";
import FBReceivePODialog from "../form/FBReceivePODialog";
import FBReceivePOTablePresenter from "./FBReceivePOTable.presenter";

export let SelectedItem: React.Context<any>;

const FBReceivePOTableContainer: React.FunctionComponent<any> = ({
  ...props
}) => {
  const dialog = useDialog();
  const { receiveState } = FB.useStores();
  useObserver(() => receiveState?.items);
  const handleEdit = (index, item) => () => {
    SelectedItem = React.createContext(item);
    dialog.open();
  };
  const closeDialog = () => {
    dialog.close();
    SelectedItem = React.createContext(undefined);
  };
  const onSubmit = () => {
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
