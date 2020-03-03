import { Box } from "@material-ui/core";
import CropFreeIcon from "@material-ui/icons/CropFree";
import PublishIcon from "@material-ui/icons/Publish";
import { Provider } from "mobx-react";
import React from "react";
import { FBMediaAlbum, FBMediaAlbumFieldProps, FBMediaAlbumFieldSockets, FBMediaQR } from "..";
import FBInput from "../components/common/FBInput";
import { withFBMediaAlbumField } from "./FBMediaAlbumField.wrap";

const FBMediaAlbumField: React.FunctionComponent<FBMediaAlbumFieldProps> = ({
  mode,
  onClick,
  qrValue = "",
  onFileUploadChange,
  mediaAlbumFieldUpload,
  collection,
  ...props
}) => (
  <Provider {...{mediaAlbumFieldUpload}} >
    <Box mt={4}>
      <FBMediaAlbumFieldSockets />
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="fb-mediaalbum-upload-button"
        onChange={onFileUploadChange}
        multiple
        type="file"
      />
      <FBInput {...props} type="textfield">
        {mode === "mediaMode" && (
          <FBMediaAlbum
            {...{ collection }}
            actionIcons={[
              {
                icon: <CropFreeIcon />,
                onClick,
              },
              {
                icon: (
                  <label htmlFor="fb-mediaalbum-upload-button">
                    <PublishIcon />
                  </label>
                ),
              },
            ]}
          />
        )}
        {mode === "qr" && <FBMediaQR {...{ qrValue }} handleClose={onClick} />}
      </FBInput>
    </Box>
  </ Provider>
);

export default withFBMediaAlbumField(FBMediaAlbumField);
