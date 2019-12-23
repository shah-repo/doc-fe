import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import useDialog from "../../../../hooks/useDialog";
import Text from "../../../Text";

interface Props {
  isMainDialogOpen: boolean;
  request: any;
}

export const WatermarkDownloader: React.FunctionComponent<Props> = ({
  isMainDialogOpen,
  request,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<any>({});
  const [requests, setRequests] = useState<any>([]);
  const dialog = useDialog();
  const handleClose = () => {
    dialog.close();
    setRequests(requests.filter((req) => req.data.id !== selectedRequest.data.id));
  };
  const handleDownload = () => {
    window.open(selectedRequest.data.presignedUrl, "_blank");
    handleClose();
  };

  useEffect(() => {
    if (request) {
      setRequests([...requests, request]);
    }
  }, [request]);

  useEffect(() => {
    if (isMainDialogOpen || requests.length === 0) {
      return;
    }

    setSelectedRequest(requests[0]);
    dialog.open();
  }, [isMainDialogOpen, requests]);

  const renderCloseButton = (
    <Button onClick={handleClose} color="primary">
      <Text translation="common.close" />
    </Button>
  );
  const renderDownloadButton = selectedRequest.success && (
    <Button onClick={handleDownload} color="primary">
      <Text translation="common.download" />
    </Button>
  );

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle>
        <Text message={selectedRequest.success ? "common.success" : "common.error"} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Text {...selectedRequest.message} />
        </DialogContentText>
      </DialogContent>
      <Box textAlign="right">
        {renderDownloadButton}
        {renderCloseButton}
      </Box>
    </Dialog>
  );
};

export default WatermarkDownloader;
