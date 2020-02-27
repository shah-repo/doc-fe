import { Box, ButtonBase, CircularProgress, Grid, IconButton, Tooltip, Typography } from "@material-ui/core";
import { CancelOutlined } from "@material-ui/icons";
import classNames from "classnames";
import React from "react";
import Text from "../../../components/Text";
import FileIcon from "./icon";
import { styles } from "./utils/styles";
import { AttachmentIconProps } from "./utils/types";

export const AttachmentIconPresenter: React.FunctionComponent<
  AttachmentIconProps
> = ({
  attachment,
  size,
  handleRemove,
  handleIconClick,
  handleContextMenu,
  disabled = false,
  isLoading,
  isUploading,
  ...other
}) => {
    const file = attachment!;
    const classes = styles({
      size: size || "md",
      disabled,
    });

    const isUploadingRenderer = () => (
      <Box>
        <Text translation="common.uploading" />
      </Box>
    );

    return (
      <Grid key={`cell-${file.id}`} item={true} xs={12} sm={4} md={2}>
        <Box className={classes.closeRoot}>
          <IconButton
            className={classes.closeRoot}
            onClick={handleRemove && handleRemove(file)}
            id="AttachmentIconPresenter-handleRemove"
          >
            <CancelOutlined className={classes.closeIcon} />
          </IconButton>
        </Box>
        <Tooltip title={`${file.name}.${file.type}`}>
          <ButtonBase
            onContextMenu={handleContextMenu && handleContextMenu(file)}
            key={`icon-${file.id}`}
            onClick={handleIconClick && handleIconClick(file)}
            id="AttachmentIconPresenter-handleIconClick"
          >
            {isLoading && <CircularProgress className={classes.progress} />}
            {!isLoading && <FileIcon {...other} extension={file.type} isUploading={isUploading} />}
          </ButtonBase>
        </Tooltip>
        <Box>
          <Typography
            variant="caption"
            gutterBottom={true}
            align="left"
            className={classNames(classes.fileName, {
              [classes.isUploading]: isUploading,
            })}
            title={`${file.name}.${file.type}`}
            id="AttachmentIconPresenter-fileTitle"
          >
            {`${file.name}.${file.type}`}
          </Typography>
        </Box>
        {isUploading && isUploadingRenderer()}
      </Grid>
    );
  };

export default AttachmentIconPresenter;
