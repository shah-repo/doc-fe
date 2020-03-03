import { Box, GridList, GridListTile, GridListTileBar, IconButton, Tooltip, Zoom } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import React from "react";
import { FBMediaGalleryProps } from ".";
import { FBMediaProps } from "..";
import FBMapWrapper from "../FBMapWrapper/FBMapWrapper";

const FBMediaGallery: React.FunctionComponent<FBMediaGalleryProps> = ({
  collection = [],
}) => (
  <Box
    display="flex"
    flexWrap="wrap"
    justifyContent="space-around"
    overflow="hidden"
    bgcolor="black"
  >
    <GridList
      cellHeight={175}
      cols={2}
      style={{ width: "100%", height: "350px" }}
    >
      <FBMapWrapper<FBMediaProps> {...{ collection }}>
        {(item, index, props) => (
          <GridListTile {...props} key={`fb-album-item-${index}`}>
            <img
              alt={item.name}
              src={item.s3link}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
            <GridListTileBar
              title={item.name}
              titlePosition="top"
              actionIcon={
                <Tooltip
                  TransitionComponent={Zoom}
                  enterDelay={300}
                  placement="left-start"
                  title={
                    <img
                      alt={item.name}
                      src={item.s3link}
                      style={{ objectFit: "cover" }}
                    />
                  }
                >
                  <IconButton style={{ color: "rgba(255, 255, 255, 0.54)" }}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              }
            />
          </GridListTile>
        )}
      </FBMapWrapper>
    </GridList>
  </Box>
);

export default FBMediaGallery;
