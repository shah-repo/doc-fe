import { Box } from "@material-ui/core";
import { Provider } from "mobx-react";
import React from "react";
import { FBLabel, FBMediaAlbum, FBMediaAlbumFieldProps, FBMediaAlbumFieldSocket, FBMediaQR } from "..";
import { withFBMediaAlbumField } from "./FBMediaAlbumField.wrap";

const FBMediaAlbumField: React.FunctionComponent<FBMediaAlbumFieldProps> = ({
  mediaAlbumFieldState,
  setMediaFieldMode,
  onFileUploadChange,
  actionsDisabled,
  removeMedia,
  isTemplate,
  qrValue = "",
  collection,
  name = "",
  loading,
  mode,
  label,
}) => (
  <Provider {...{ [`mediaAlbumFieldState_${name}`]: mediaAlbumFieldState }} >
    <Box mb={6}>
      {label && <FBLabel {...{ label }} />}
      <FBMediaAlbumFieldSocket fieldNameFromSchema={name} />
      {mode !== "qr" && (
        <FBMediaAlbum {...{
          collection,
          removeMedia,
          setMediaFieldMode,
          loading,
          name,
          onFileUploadChange,
          actionsDisabled,
        }}
        />
      )}
      {mode === "qr" && (
        <FBMediaQR
          {...{ qrValue, isTemplate, setMediaFieldMode, loading }}
        />)}
    </Box>
  </ Provider>
);

export default withFBMediaAlbumField(FBMediaAlbumField);
