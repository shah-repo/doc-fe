import { Box } from "@material-ui/core";
import CropFreeIcon from "@material-ui/icons/CropFree";
import React from "react";
import { FBMediaAlbum, FBMediaAlbumFieldProps, FBMediaQR } from "..";
import FBInput from "../components/common/FBInput";
import { withFBMediaAlbumField } from "./FBMediaAlbumField.wrap";

const FBMediaAlbumField: React.FunctionComponent<FBMediaAlbumFieldProps> = ({
  mode,
  onClick,
  qrValue = "",
  ...props
}) => (
  <Box mt={4}>
    <FBInput {...props} type="textfield">
      {mode === "mediaMode" && (
        <FBMediaAlbum
          actionIcons={[
            {
              icon: <CropFreeIcon />,
              onClick
            }
          ]}
        />
      )}
      {mode === "qr" && <FBMediaQR {...{ qrValue }} handleClose={onClick} />}
    </FBInput>
  </Box>
);

export default withFBMediaAlbumField(FBMediaAlbumField);
