import { Box, CircularProgress, createStyles, GridList, GridListTile, GridListTileBar, IconButton, makeStyles, Theme, Tooltip, Zoom } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import React from "react";
import Img from "react-image";
import LazyLoad from "react-lazy-load";
import { FBMediaGalleryProps } from ".";
import { FBMediaProps } from "..";
import FBMapWrapper from "../FBMapWrapper/FBMapWrapper";


const FBMediaGallery: React.FunctionComponent<FBMediaGalleryProps> = ({
  collection = [],
  removeMedia,
}) => {

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      noMaxWidth: {
        maxWidth: "none",
      },
    }),
  );

  const classes = useStyles();

  return(
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
              <LazyLoad height={175}>
                <Img
                  style={{ objectFit: "cover", width: "100%", height: "175px" }}
                  src={item.s3link}
                  loader={
                    <Box
                      height={175}
                      display="flex"
                      color="white"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <CircularProgress color="inherit" />
                    </Box>
                  }
                />
              </LazyLoad>
              <GridListTileBar
                title={item.name}
                titlePosition="top"
                actionIcon={
                  <Box display="flex" flexDirection="row-reverse" color="white">
                    {/* Note* do not delete it
                    <IconButton
                      color="inherit"
                      size="small"
                      onClick={removeMedia && removeMedia(item.id)}
                    >
                      <DeleteForeverIcon />
                    </IconButton> */}
                    <Tooltip
                      TransitionComponent={Zoom}
                      enterDelay={300}
                      placement="left-start"
                      classes={{ tooltip: classes.noMaxWidth }}
                      title={
                        <img
                          alt={item.name}
                          src={item.s3link}
                          style={{ objectFit: "cover", maxHeight: "600px", maxWidth: "600px" }}
                        />
                      }
                    >
                      <IconButton color="inherit" size="small">
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              />
            </GridListTile>
          )}
        </FBMapWrapper>
      </GridList>
    </Box>
  );
};


export default FBMediaGallery;
