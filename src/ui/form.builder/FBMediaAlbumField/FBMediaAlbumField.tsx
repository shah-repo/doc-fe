import { Box } from "@material-ui/core";
import { Provider } from "mobx-react";
import React from "react";
import { FBMediaAlbum, FBMediaAlbumFieldProps, FBMediaAlbumFieldSocket, FBMediaQR } from "..";
import FBInput from "../components/common/FBInput";
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
  ...props
}) => (
  <Provider {...{ [`mediaAlbumFieldState_${name}`]: mediaAlbumFieldState }} >
    <Box mt={4}>
      <FBInput {...props} {...{ name }}>
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
        {mode === "qr" && <FBMediaQR {...{ qrValue, isTemplate, setMediaFieldMode, loading }} />}
      </FBInput>
    </Box>
  </ Provider>
);

export default withFBMediaAlbumField(FBMediaAlbumField);
