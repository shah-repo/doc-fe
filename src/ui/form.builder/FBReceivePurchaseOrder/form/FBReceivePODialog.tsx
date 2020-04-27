import { Dialog, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import FBReceivePOFormContainer from "./FBReceivePOForm.container";
const FBReceivePODialog: React.FunctionComponent<any> = ({
  onSubmit,
  name,
  closeDialog,
  isDialogOpen,
}) => {
  const renderDialog = isDialogOpen && (
    <Dialog
      open={isDialogOpen}
      fullWidth={true}
      id="FBReceivePODialog-openButton"
    >
      <DialogTitle >
        <Typography align="center" variant="h4">
          <Text translation="form.builder.po.items.received" />
        </Typography>
      </DialogTitle>
      <DialogContent id="FBReceivePODialog-closeDialog">
        <FBReceivePOFormContainer closeDialog={closeDialog} onSubmit={onSubmit} name={name} />
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {renderDialog}
    </>
  );
};

export default FBReceivePODialog;
