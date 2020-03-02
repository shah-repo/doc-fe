import { Box, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import QRCode from "qrcode.react";
import React from "react";
import { FBMediaQRProps } from ".";
import FBStore from "../stores/ui/FBStore";
import { withFBMediaQR } from "./FBMediaQR.wrap";

const FBMediaQR: React.FunctionComponent<FBMediaQRProps> = ({
  qrValue,
  disabled,
  handleClose
}) => (
  <Box>
    {!disabled && (
      <Box>
        <Box display="flex" justifyContent="flex-end" p={1} bgcolor="black">
          <IconButton
            onClick={() => handleClose && handleClose()}
            size="small"
            style={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box display="flex" justifyContent="center" py={8}>
          <QRCode value={qrValue} />
        </Box>
      </Box>
    )}
    {disabled && FBStore.mode !== "form" && (
      <Box>Scan QR will be placed here</Box>
    )}
    {disabled && FBStore.mode === "form" && (
      <Box>You must save the document in order to scan QR code.</Box>
    )}
  </Box>
);

export default withFBMediaQR(FBMediaQR);
