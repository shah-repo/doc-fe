import { Box, IconButton, Tooltip } from "@material-ui/core";
import AllOutIcon from "@material-ui/icons/AllOut";
import AppsIcon from "@material-ui/icons/Apps";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Provider } from "mobx-react";
import React from "react";
import { FBMediaAlbumActionProps, FBMediaAlbumProps } from ".";
import { FBMediaGallery } from "..";
import Text from "../../components/Text";
import FBMapWrapper from "../FBMapWrapper/FBMapWrapper";
import FBMediaCarousel from "../FBMediaCarousel";
import { withFBMediaAlbum } from "./FBMediaAlbum.wrap";

const FBMediaAlbum: React.FunctionComponent<FBMediaAlbumProps> = ({
  mediaAlbumState,
  collection,
  title,
  onClick,
  fieldMode,
  mode,
  actionIcons = [],
  removeMedia,
  remove,
  ...props
}) => (
  <Provider {...{ mediaAlbumState }}>
    <Box bgcolor="black" borderColor="white" borderBottom={0.5} {...props}>
      <Box display="flex" p={1}>
        <Box p={1} flexGrow={1} color="white">
          {title}
        </Box>
        <Box pl={0.3} color="white">
          <IconButton size="small" {...{ onClick }} color="inherit">
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
        <FBMapWrapper<FBMediaAlbumActionProps> collection={actionIcons}>
          {(item, index) => (
            <Box pl={0.3} color="white">
              <IconButton
                key={`fb-media-action-${index}`}
                size="small"
                color="inherit"
                onClick={item.onClick}
              >
                {item.icon}
              </IconButton>
            </Box>
          )}
        </FBMapWrapper>
        <Box pl={0.3} color="white">
          <IconButton
            disabled={!(fieldMode !== "preview" && mode === "carousel")}
            size="small"
            onClick={remove}
            color="inherit"
          >
            <Tooltip title={<Text message="form.builder.delete" />}>
              <DeleteForeverIcon />
            </Tooltip>
          </IconButton>
        </Box>
      </Box>
    </Box>
    {mode === "carousel" && <FBMediaCarousel {...{ collection, removeMedia }} />}
    {mode === "gallery" && <FBMediaGallery {...{ collection, removeMedia }} />}
  </Provider>
);

export default withFBMediaAlbum(FBMediaAlbum);
