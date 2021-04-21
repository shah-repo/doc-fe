import { Box, CircularProgress, IconButton, Tooltip } from "@material-ui/core";
import AlbumIcon from "@material-ui/icons/Album";
import QRCode from "qrcode.react";
import React from "react";
import { FBMediaQRProps } from "..";
import Text from "../../components/Text";
import { withFBMediaQR } from "./FBMediaQR.wrap";

const FBMediaQR: React.FunctionComponent<FBMediaQRProps> = ({
  setMediaFieldMode,
  loading,
  qrValue,
  mode,
}) => (
  <Box>
    {mode === "qr" && (
      <>
        <Box display="flex" flexDirection="row-reverse" py={0.8}>
          <IconButton data-cy="albumMediaButton" size="small" onClick={setMediaFieldMode}>
            <Tooltip title={<Text message="form.builder.album" />}>
              <AlbumIcon />
            </Tooltip>
          </IconButton>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          height={350}
          justifyContent="center"
          bgcolor="#f6f7f7"
        >
          {loading && (
            <Box height="100%" display="flex" alignItems="center">
              <CircularProgress />
            </Box>
          )}
          {!loading && <QRCode size={200} value={qrValue} />}
        </Box>
      </>
    )}
    {mode === "placeholder" && <Text message="form.builder.media.album.placeholder" />}
    {mode === "preupload" && <Text message="form.builder.media.album.output.placeholder" />}
  </Box>
);

export default withFBMediaQR(FBMediaQR);
