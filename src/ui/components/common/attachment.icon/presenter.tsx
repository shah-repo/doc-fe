import {
  Box,
  ButtonBase,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
  Tooltip,
} from "@material-ui/core";
import { CancelOutlined } from "@material-ui/icons";
import classNames from "classnames";
import React from "react";
import FileIcon from "./icon";
import { styles } from "./utils/styles";
import { AttachmentIconProps } from "./utils/types";
import Text from "../../../components/Text";

export const AttachmentIconPresenter: React.FunctionComponent<
  AttachmentIconProps
> = ({
  attachment,
  size,
  handleRemove,
  handleDownload,
  handleContextMenu,
  disabled = false,
  ...other
}) => {
  const file = attachment!;
  const isUploading = file.s3link == null;
  const isLoading = file.isLoading || false;

  const classes = styles({
    size: size || "md",
    disabled: disabled || isUploading,
  });

  const isUploadingRenderer = () => (
    <Box>
      <Text translation="common.uploading"/>
    </Box>
  );

  return (
    <Grid key={`cell-${attachment!.id}`} item={true} xs={12} sm={4} md={2}>
      <Box className={classes.closeRoot}>
        <IconButton
          className={classes.closeRoot}
          onClick={handleRemove && handleRemove(file)}>
          <CancelOutlined className={classes.closeIcon} />
        </IconButton>
      </Box>
      <Tooltip title={`${attachment!.name}.${attachment!.type}`}>
        <ButtonBase
          onContextMenu={handleContextMenu && handleContextMenu(file)}
          key={`icon-${attachment!.id}`}
          onClick={handleDownload && handleDownload(file)}>
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
          title={`${file.name}.${file.type}`}>
          {`${file.name}.${file.type}`}
        </Typography>
      </Box>
      {isUploading && isUploadingRenderer()}
    </Grid>
  );
};

export default AttachmentIconPresenter;
