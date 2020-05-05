import { Box, CircularProgress, createStyles, GridList, GridListTile, GridListTileBar, IconButton, makeStyles, Theme, Tooltip, Zoom } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import VisibilityIcon from "@material-ui/icons/Visibility";
import React from "react";
import Img from "react-image";
import LazyLoad from "react-lazy-load";
import { FBMapWrapper, FBMediaGalleryProps, FBMediaProps } from "..";
import Text from "../../components/Text";
import { withFBMediaGallery } from "./FBMediaGallery.wrap";


const FBMediaGallery: React.FunctionComponent<FBMediaGalleryProps> = ({
  collection = [],
  handleDelete,
  actionsDisabled,
}) => {

  const useStyles = makeStyles((_theme: Theme) =>
    createStyles({
      noMaxWidth: {
        maxWidth: "none",
      },
    }),
  );

  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="space-around"
      overflow="hidden"
      bgcolor="#f6f7f7"
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
                      <CircularProgress />
                    </Box>
                  }
                />
              </LazyLoad>
              <GridListTileBar
                subtitle={(
                  <Tooltip title={item.name}>
                    <Box
                      style={{ whiteSpace: "nowrap" }}
                      textOverflow="ellipsis"
                      overflow="hidden">
                      {item.name}
                    </Box>
                  </Tooltip>
                )}
                titlePosition="top"
                style={{ height: "35px" }}
                actionIcon={
                  <Box display="flex" flexDirection="row-reverse" color="white">
                    <IconButton
                      color="inherit"
                      size="small"
                      disabled={actionsDisabled}
                      onClick={() => handleDelete && handleDelete(item.id)}
                    >
                      <Tooltip title={<Text message="form.builder.delete" />}>
                        <DeleteForeverIcon fontSize="small" />
                      </Tooltip>
                    </IconButton>
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
                        <VisibilityIcon fontSize="small" />
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


export default withFBMediaGallery(FBMediaGallery);
