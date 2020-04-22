import { Box, CircularProgress, IconButton, Tooltip } from "@material-ui/core";
import AllOutIcon from "@material-ui/icons/AllOut";
import AppsIcon from "@material-ui/icons/Apps";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CropFreeIcon from "@material-ui/icons/CropFree";
import React from "react";
import { FBMediaAlbumProps } from ".";
import { FBMediaGallery, FBProvider } from "..";
import Text from "../../components/Text";
import FBMediaCarousel from "../FBMediaCarousel";
import { withFBMediaAlbum } from "./FBMediaAlbum.wrap";

const FBMediaAlbum: React.FunctionComponent<FBMediaAlbumProps> = ({
  setMediaFieldMode,
  onFileUploadChange,
  mediaAlbumState,
  setMediaMode,
  removeMedia,
  actionsDisabled,
  collection,
  loading,
  name,
  title,
  mode,
  ...props
}) => (
  <FBProvider {...{ mediaAlbumState }}>
    <input
      accept="image/*"
      style={{ display: "none" }}
      id={`fb-mediaalbum-upload-${name}`}
      onChange={onFileUploadChange}
      multiple
      type="file"
    />
    <Box {...props} >
      <Box display="flex" py={0.5}>
        <Tooltip {...{ title }}>
          <Box
            style={{ whiteSpace: "nowrap" }}
            textOverflow="ellipsis"
            overflow="hidden"
            flexGrow={1}
          >
            {title}
          </Box>
        </Tooltip>
        <Box pl={0.3}>
          <IconButton size="small" onClick={setMediaMode}>
            {mode === "carousel" && (
              <Tooltip title={<Text message="form.builder.gallery" />}>
                <AppsIcon />
              </Tooltip>
            )}
            {mode === "gallery" && (
              <Tooltip title={<Text message="form.builder.carousel" />}>
                <AllOutIcon />
              </Tooltip>
            )}
          </IconButton>
        </Box>
        <Box pl={0.3}>
          <IconButton size="small" disabled={actionsDisabled}>
            {loading && <CircularProgress size={20} />}
            {!loading && (
              <label htmlFor={`fb-mediaalbum-upload-${name}`}>
                <Tooltip title={<Text message="form.builder.upload" />}>
                  <CloudUploadIcon />
                </Tooltip>
              </label>
            )}
          </IconButton>
        </Box>
        <Box pl={0.3}>
          <IconButton size="small" disabled={actionsDisabled} onClick={setMediaFieldMode}>
            <Tooltip title={<Text message="form.builder.qr.code" />}>
              <CropFreeIcon />
            </Tooltip>
          </IconButton>
        </Box>
      </Box>
    </Box>
    {mode === "carousel" && <FBMediaCarousel {...{ collection, removeMedia, actionsDisabled }} />}
    {mode === "gallery" && <FBMediaGallery {...{ collection, removeMedia, actionsDisabled }} />}
  </FBProvider>
);

export default withFBMediaAlbum(FBMediaAlbum);
