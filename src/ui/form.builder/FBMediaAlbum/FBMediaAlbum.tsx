import { Box, CircularProgress, IconButton, Tooltip } from "@material-ui/core";
import AllOutIcon from "@material-ui/icons/AllOut";
import AppsIcon from "@material-ui/icons/Apps";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CropFreeIcon from "@material-ui/icons/CropFree";
import { truncate } from "lodash";
import { Observer } from "mobx-react";
import React from "react";
import { FBMediaAlbumProps, FBMediaCarousel, FBMediaGallery, FBProvider, FBTooltip } from "..";
import Text from "../../components/Text";
import { withFBMediaAlbum } from "./FBMediaAlbum.wrap";

const FBMediaAlbum: React.FunctionComponent<FBMediaAlbumProps> = ({
  onClick,
  setMediaFieldMode,
  onFileUploadChange,
  setMediaMode,
  removeMedia,
  mediaAlbumState,
  formState,
  actionsDisabled,
  workspaceMode,
  collection,
  hiddenContainer,
  loading,
  name,
  title,
  mode,
  autosave,
  uploadDisabled,
  ...props
}) => (
  <FBProvider {...{ mediaAlbumState }}>
    <input
      accept="image/*, video/*"
      style={{ display: "none" }}
      id={`fb-mediaalbum-upload-${name}`}
      onChange={onFileUploadChange}
      multiple
      type="file"
    />
    <Box {...props} >
      <Box display="flex" py={0.5}>
        <Box
          style={{ whiteSpace: "nowrap" }}
          textOverflow="ellipsis"
          overflow="hidden"
          flexGrow={1}
        >
          <FBTooltip {...{ title }}>
            {truncate(title, {
              length: 70,
              omission: " ...",
            })}
          </FBTooltip>
        </Box>
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
          <Observer>
            {() => (
              <IconButton size="small" disabled={actionsDisabled || uploadDisabled || formState?.isBackdropOpen}>
                {loading && <CircularProgress size={20} />}
                {!loading && (
                  <label htmlFor={`fb-mediaalbum-upload-${name}`} >
                    <Tooltip title={<Text message="form.builder.upload" />}>
                      <CloudUploadIcon  onClick={onClick} />
                    </Tooltip>
                  </label>
                )}
              </IconButton>
            )}
          </Observer>
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
    {!hiddenContainer && (
      <>
        {mode === "carousel" && <FBMediaCarousel {...{ collection, removeMedia, actionsDisabled, autosave }} />}
        {mode === "gallery" && <FBMediaGallery {...{ collection, removeMedia, actionsDisabled, autosave }} />}
      </>
    )}
  </FBProvider>
);

export default withFBMediaAlbum(FBMediaAlbum);
