import { Box, ButtonBase, CircularProgress, IconButton, Tooltip, Typography } from "@material-ui/core";
import { CancelOutlined } from "@material-ui/icons";
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
    <Box className={classes.closeRoot} style={{ padding: 0, margin: 0, position: "absolute", right: -10, top: -10 }}>
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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginRight: "3rem", marginBottom: "1rem" }}>
      <div style={{ width: "min-content", position: "relative", marginRight: "0.7rem" }}>
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
        {isRedLine && <hr className={classes.underLine}/>}
      </div>
      <div>
        <Typography
          style={{ fontWeight: "bold" }}
          variant="caption"
          gutterBottom={true}
          align="left"
          title={`${file.name}.${file.type}`}
          id="AttachmentIconPresenter-fileTitle"
        >
          {`${file.name}.${file.type}`}
        </Typography>
        <Typography
          variant="caption"
          gutterBottom={true}
          align="left"
          display="block"
        >
          Docx
        </Typography>
      </div>
      {isUploading && isUploadingRenderer()}
    </div>
  );
};

export default AttachmentIconPresenter;
