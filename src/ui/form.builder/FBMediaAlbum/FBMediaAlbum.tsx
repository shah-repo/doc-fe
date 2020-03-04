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
    <Box bgcolor="black" borderColor="white" borderBottom={0.5} {...props}>
      <Box display="flex" p={1}>
        <Box p={1} flexGrow={1} color="white">
          {title}
        </Box>
        <Box px={0.3} color="white">
          <IconButton size="small" {...{ onClick }} color="inherit">
            {mode === "carousel" && <AppsIcon />}
            {mode === "gallery" && <AllOutIcon />}
          </IconButton>
        </Box>
        <FBMapWrapper<FBMediaAlbumActionProps> collection={actionIcons}>
          {(item, index) => (
            <Box px={0.3} color="white">
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
      </Box>
    </Box>
    {mode === "carousel" && <FBMediaCarousel {...{ collection }} />}
    {mode === "gallery" && <FBMediaGallery {...{ collection }} />}
  </Provider>
);

export default withFBMediaAlbum(FBMediaAlbum);
