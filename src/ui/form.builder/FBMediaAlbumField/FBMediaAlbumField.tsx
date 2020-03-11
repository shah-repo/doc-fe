import { Box, CircularProgress, Tooltip } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CropFreeIcon from "@material-ui/icons/CropFree";
import { Provider } from "mobx-react";
import React from "react";
import { FBMediaAlbum, FBMediaAlbumFieldProps, FBMediaAlbumFieldSocket, FBMediaQR } from "..";
import Text from "../../components/Text";
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
  isTemplate,
  removeMedia,
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
        {(mode === "mediaMode" || mode === "preview") && (
          <FBMediaAlbum
            {...{ collection, removeMedia }}
            fieldMode={mode}
            actionIcons={[
              {
                icon: (<>{mode !== "preview" && (
                  <Tooltip title={<Text message="form.builder.qr.code" />}>
                    <CropFreeIcon />
                  </Tooltip>
                )}</>),
                onClick,
              },
              {
                icon: (
                  <>
                    {mode !== "preview" && loading && <CircularProgress color="inherit" size={20} />}
                    {mode !== "preview" && !loading && (
                      <label htmlFor={`fb-mediaalbum-upload-${name}`}>
                        <Tooltip title={<Text message="form.builder.upload" />}>
                          <CloudUploadIcon />
                        </Tooltip>
                      </label>
                    )}
                  </>
                ),
              },
            ]}
          />
        )}
        {mode === "qr" && <FBMediaQR {...{ qrValue, isTemplate }} handleClose={onClick} />}
      </FBInput>
    </Box>
  </ Provider>
);

export default withFBMediaAlbumField(FBMediaAlbumField);
