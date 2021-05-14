import React from "react";
import { FBInput, FBMediaAlbum, FBMediaAlbumFieldProps, FBMediaQR, FBProvider } from "..";
import { withFBMediaAlbumField } from "./FBMediaAlbumField.wrap";

const FBMediaAlbumField: React.FunctionComponent<FBMediaAlbumFieldProps> = ({
  setMediaFieldMode,
  onFileUploadChange,
  removeMedia,
  mediaAlbumFieldState,
  actionsDisabled,
  isTemplate,
  qrValue = "",
  collection,
  name = "",
  loading,
  editorConfig,
  autosave,
  mode,
  label,
  index,
  gutter,
}) => (
  <FBProvider {...{ [`mediaAlbumFieldState_${name}`]: mediaAlbumFieldState }} >
    <FBInput {...{ name, label, gutter, index, editorConfig, autosave }} type="mediaalbum">
      {mode !== "qr" && (
        <FBMediaAlbum {...{
          collection,
          removeMedia,
          setMediaFieldMode,
          loading,
          name,
          onFileUploadChange,
          actionsDisabled,
          autosave,
        }}
        />
      )}
      {mode === "qr" && (
        <FBMediaQR
          {...{ qrValue, isTemplate, setMediaFieldMode, loading }}
        />)}
    </FBInput>
  </FBProvider>
);

export default withFBMediaAlbumField(FBMediaAlbumField);
