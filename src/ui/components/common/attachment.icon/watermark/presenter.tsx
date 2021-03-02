import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import React from "react";
import Text from "../../../Text";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  content: any;
}

const WatermarkPresenter: React.FunctionComponent<Props> = ({
  isOpen,
  handleClose,
  title,
  content,
  children,
}) => (
  <Dialog
    open={isOpen}
    onClose={handleClose}
    maxWidth="sm"
    fullWidth={true}
  >
    <DialogTitle>
      <Text message={title} />
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        <Text {...content} />
      </DialogContentText>
    </DialogContent>
    <Box textAlign="right">
      {children}
    </Box>
  </Dialog>
);

export default WatermarkPresenter;
