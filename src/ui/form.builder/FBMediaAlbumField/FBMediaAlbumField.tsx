import { Provider } from "mobx-react";
import React from "react";
import { FBInput, FBMediaAlbum, FBMediaAlbumFieldProps, FBMediaQR } from "..";
import { withFBMediaAlbumField } from "./FBMediaAlbumField.wrap";

const FBMediaAlbumField: React.FunctionComponent<FBMediaAlbumFieldProps> = ({
  setMediaFieldMode,
  onFileUploadChange,
  removeMedia,
  mediaAlbumFieldState,
  actionsDisabled,
  isTemplate,
  qrValue,
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
  <Provider {...{ mediaAlbumFieldState }} >
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
        }}
        />
      )}
      {mode === "qr" && (
        <FBMediaQR
          {...{ qrValue, isTemplate, setMediaFieldMode, loading }}
        />)}
    </FBInput>
  </ Provider>
);

export default withFBMediaAlbumField(FBMediaAlbumField);
