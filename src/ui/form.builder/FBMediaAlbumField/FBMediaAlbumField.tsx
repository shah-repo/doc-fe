import { Box, CircularProgress } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CropFreeIcon from "@material-ui/icons/CropFree";
import { Provider } from "mobx-react";
import React from "react";
import { FBMediaAlbum, FBMediaAlbumFieldProps, FBMediaAlbumFieldSocket, FBMediaQR } from "..";
import FBInput from "../components/common/FBInput";
import { withFBMediaAlbumField } from "./FBMediaAlbumField.wrap";

const FBMediaAlbumField: React.FunctionComponent<FBMediaAlbumFieldProps> = ({
  mode,
  onClick,
  qrValue = "",
  onFileUploadChange,
  mediaAlbumFieldState,
  collection,
  name = "",
  loading,
  ...props
}) => (
  <Provider {...{ [`mediaAlbumFieldState_${name}`]: mediaAlbumFieldState }} >
    <Box mt={4}>
      <FBMediaAlbumFieldSocket fieldNameFromSchema={name} />
      <input
        accept="image/*"
        style={{ display: "none" }}
        id={`fb-mediaalbum-upload-${name}`}
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
                  <>
                    {loading && <CircularProgress color="inherit" size={20} />}
                    {!loading && (
                      <label htmlFor={`fb-mediaalbum-upload-${name}`}>
                        <CloudUploadIcon />
                      </label>
                    )}
                  </>
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
