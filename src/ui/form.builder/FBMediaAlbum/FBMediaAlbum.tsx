import { Box, IconButton } from "@material-ui/core";
import AllOutIcon from "@material-ui/icons/AllOut";
import AppsIcon from "@material-ui/icons/Apps";
import { Provider } from "mobx-react";
import React from "react";
import { FBMediaAlbumActionProps, FBMediaAlbumProps } from ".";
import { FBMediaGallery } from "..";
import FBMapWrapper from "../FBMapWrapper/FBMapWrapper";
import FBMediaCarousel from "../FBMediaCarousel";
import { withFBMediaAlbum } from "./FBMediaAlbum.wrap";

const FBMediaAlbum: React.FunctionComponent<FBMediaAlbumProps> = ({
  mediaAlbumState,
  collection,
  title,
  onClick,
  mode,
  actionIcons = [],
  ...props
}) => (
  <Provider {...{ mediaAlbumState }}>
    <Box bgcolor="black" {...props}>
      <Box display="flex" p={1}>
        <Box p={1} flexGrow={1} color="white">
          {title}
        </Box>
        <Box p={1} color="white">
          <IconButton size="small" {...{ onClick }} style={{ color: "white" }}>
            {mode === "carousel" && <AppsIcon />}
            {mode === "gallery" && <AllOutIcon />}
          </IconButton>
        </Box>
        <FBMapWrapper<FBMediaAlbumActionProps> collection={actionIcons}>
          {(item, index) => (
            <IconButton
              key={`fb-media-action-${index}`}
              size="small"
              style={{ color: "white" }}
              onClick={item.onClick}
            >
              {item.icon}
            </IconButton>
          )}
        </FBMapWrapper>
      </Box>
    </Box>
    {mode === "carousel" && <FBMediaCarousel {...{ collection }} />}
    {mode === "gallery" && <FBMediaGallery {...{ collection }} />}
  </Provider>
);

export default withFBMediaAlbum(FBMediaAlbum);
