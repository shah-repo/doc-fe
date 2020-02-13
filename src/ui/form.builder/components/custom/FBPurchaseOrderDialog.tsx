import { Dialog, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { DialogHandler } from "../../../hooks/useDialog";
import FBPurchaseOrderForm from "../form/FBPruchaseOrderForm";
import FBButton from "../inputs/FBButton";

interface Props {
  dialog: DialogHandler;
  initialValues: {};
  onSubmit: (values: any) => void;
  disabled: boolean;
}

const FBPurchaseOrderDialog: React.FunctionComponent<Props> = ({
  dialog,
  onSubmit,
  disabled,
  initialValues,
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
        <Typography align="center" variant="h4">
          <Text translation="form.builder.add.item" />
        </Typography>
      </DialogTitle>
      <DialogContent>
        <FBPurchaseOrderForm
          closeDialog={closeDialog}
          onSubmit={handleSubmit}
          initialValues={initialValues}
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
