import {
  Box,
  ButtonBase,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import { CancelOutlined } from "@material-ui/icons";
import React from "react";
import FileIcon from "./icon";
import { styles } from "./utils/styles";
import { AttachmentIconProps } from "./utils/types";

export const AttachmentIconPresenter: React.FunctionComponent<
  AttachmentIconProps
> = ({ attachment, size, handleRemove, handleDownload, ...other }) => {
  const classes = styles({ size: size || "md" });
  const file = attachment!;
  const isLoading = file.isLoading || false;

  return (
    <Grid
      key={`cell-${attachment!.id}`}
      item={true}
      xs={12}
      sm={4}
      md={2}
      style={{ marginBottom: 35 }}
    >
      <Box className={classes.closeRoot}>
        <IconButton
          className={classes.closeRoot}
          onClick={handleRemove && handleRemove(file)}
        >
          <CancelOutlined className={classes.closeIcon} />
        </IconButton>
      </Box>
      <ButtonBase
        key={`icon-${attachment!.id}`}
        onClick={handleDownload && handleDownload(file)}
      >
        {isLoading && <CircularProgress className={classes.progress} />}
        {!isLoading && <FileIcon {...other} extension={file.type} />}
      </ButtonBase>
      <Box>
        <Typography
          variant="caption"
          gutterBottom={true}
          align="left"
          className={classes.fileName}
          title={`${file.name}.${file.type}`}
        >
          {`${file.name}.${file.type}`}
        </Typography>
      </Box>
    </Grid>
  );
};

export default AttachmentIconPresenter;
