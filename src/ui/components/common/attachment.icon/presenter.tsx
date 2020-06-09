import { Box, ButtonBase, CircularProgress, Grid, IconButton, Tooltip, Typography } from "@material-ui/core";
import { CancelOutlined } from "@material-ui/icons";
import classNames from "classnames";
import React from "react";
import { Attachment } from "../../../../state/ducks/attachments";
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
  handleContextMenu,
  disabled = false,
  isLoading,
  isUploading,
  isRedLine,
  handleIconClick,
  canDeleteFile,
  ...other
}) => {
  const file = attachment || {} as Attachment;
  const classes = styles({
    size: size || "md",
    disabled,
  });

  const isUploadingRenderer = () => (
    <Box>
      <Text translation="common.uploading" />
    </Box>
  );

  const deleteButtonRenderer = canDeleteFile && (
    <Box className={classes.closeRoot}>
      <IconButton
        className={classes.closeRoot}
        onClick={handleRemove && handleRemove(file)}
        id="AttachmentIconPresenter-handleRemove"
      >
        <CancelOutlined className={classes.closeIcon} />
      </IconButton>
    </Box>
  );
  return (
    <Grid key={`cell-${file.id}`} item={true} xs={2} sm={1} md={1}>
      {deleteButtonRenderer}
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

          {isRedLine && <hr className={classes.underLine}/>}
          {`${file.name}.${file.type}`}
        </Typography>
      </Box>
      {isUploading && isUploadingRenderer()}
    </Grid>
  );
};

export default AttachmentIconPresenter;
