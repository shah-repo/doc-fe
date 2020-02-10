import { Dialog, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import React from "react";
import { DialogHandler } from "../../../hooks/useDialog";
import FBPurchaseOrderForm from "../form/FBPruchaseOrderForm";
import FBButton from "../inputs/FBButton";

interface Props {
  dialog: DialogHandler;
  onSubmit: (values: any) => void;
  disabled: boolean;
}

const FBPurchaseOrderDialog: React.FunctionComponent<Props> = ({
  dialog,
  onSubmit,
  disabled,
}) => {
  const addItem = () => {
    dialog.open();
  };

  const closeDialog = () => {
    dialog.close();
  };

  const handleSubmit = (values: any) => {
    onSubmit(values);
    closeDialog();
  };

  const renderDialog = dialog.isOpen && (
    <Dialog
      open={dialog.isOpen}
      onClose={closeDialog}
      fullWidth={true}
    >
      <DialogTitle >
        <Typography align="center">
          Add an item
        </Typography>
      </DialogTitle>
      <DialogContent>
        <FBPurchaseOrderForm
          closeDialog={closeDialog}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <FBButton
        fullWidth={true}
        disabled={disabled}
        label="form.builder.add.item"
        onClick={addItem}
        variant="outlined"
        style={{ margin: "8px 0" }}
      />
      {renderDialog}
    </>
  );
};

export default FBPurchaseOrderDialog;
