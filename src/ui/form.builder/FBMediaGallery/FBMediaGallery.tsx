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
  handleDelete,
  previewType,
  collection = [],
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
        <FBMapWrapper<FBMediaProps[]> {...{ collection }}>
          {(media: FBMediaProps, index, props) => {
            const type = previewType?.(media);
            const { s3link: src, name, id } = media;
            if (!type) { return; }
            return (
              <GridListTile {...props} key={`fb-album-item-${index}`}>
                {/* Render LazyLoad only with non optional child or it
                will crash otherwise :/ */}
                {type === "image" && (
                  <LazyLoad height={175}>
                    <Img
                      {...{ src }}
                      style={{ objectFit: "cover", width: "100%", height: "175px" }}
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
                )}
                {type === "video" && (
                  <LazyLoad height={175}>
                    <video controls={true} width="100%" height="95%" {... { src }}>
                      <Text translation="file.viewer.video.not.supported" />
                    </video>
                  </LazyLoad>
                )}
                {type === "pdf" && (
                  <LazyLoad height={175}>
                    <object width="100%" height="100%" type="application/pdf" data={src}>
                      <Text translation="common.file.not.loaded" />
                    </object>
                  </LazyLoad>
                )}
                <GridListTileBar
                  subtitle={(
                    <Tooltip title={name}>
                      <Box
                        style={{ whiteSpace: "nowrap" }}
                        textOverflow="ellipsis"
                        overflow="hidden">
                        {name}
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
                        onClick={() => handleDelete && handleDelete(id)}
                      >
                        <Tooltip title={<Text message="form.builder.delete" />}>
                          <DeleteForeverIcon fontSize="small" />
                        </Tooltip>
                      </IconButton>
                      {type === "image" && (
                        <Tooltip
                          TransitionComponent={Zoom}
                          enterDelay={300}
                          placement="left-start"
                          classes={{ tooltip: classes.noMaxWidth }}
                          title={
                            <img
                              style={{ objectFit: "cover", maxHeight: "600px", maxWidth: "600px" }}
                              alt={name}
                              {...{ src }}
                            />
                          }
                        >
                          <IconButton color="inherit" size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  }
                />
              </GridListTile>
            );
          }}
        </FBMapWrapper>
      </GridList>
    </Box>
  );
};


export default withFBMediaGallery(FBMediaGallery);
