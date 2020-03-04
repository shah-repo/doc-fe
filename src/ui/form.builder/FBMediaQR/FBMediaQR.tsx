import { Box, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import QRCode from "qrcode.react";
import React from "react";
import { FBMediaQRProps } from ".";
import Text from "../../components/Text";
import { withFBMediaQR } from "./FBMediaQR.wrap";

const FBMediaQR: React.FunctionComponent<FBMediaQRProps> = ({
  qrValue,
  handleClose,
  mode,
}) => (
  <Box>
    {mode === "qr" && (
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
    {mode === "placeholder" && (
      <Box>
        <Text message="form.builder.media.album.placeholder" />
      </Box>
    )}
    {mode === "preupload" && (
      <Box>
        <Text message="form.builder.media.album.output.placeholder" />
      </Box>
    )}
  </Box>
);

export default withFBMediaQR(FBMediaQR);
