import { Box, ButtonBase, CircularProgress, IconButton, Tooltip, Typography } from "@material-ui/core";
import { CancelOutlined } from "@material-ui/icons";
import StarsRoundedIcon from "@material-ui/icons/StarsRounded";
import classNames from "classnames";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { Attachment } from "../../../../state/ducks/attachments";
import Text from "../../../components/Text";
import { FormHeaderContext } from "../../../documentRevision/forms/DocumentRevisionForm.presenter";
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
  const intl = useIntl();
  const fileSize = useMemo(() => {
    const size = file.fileSizeS3Link;
    const i = Math.floor( Math.log(size) / Math.log(1024) );
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${["B", "kB", "MB", "GB", "TB"][i]}`;
  }, [file.fileSizeS3Link]);
  const fileTypeDescription = useMemo(() => {
    const microsoftFiles = ["XLSX", "XLS", "DOCX", "DOC"];
    const type = file.type.toUpperCase();
    if (microsoftFiles.includes(type)) {
      return intl.formatMessage({ id: `file.type.${type}` });
    }

    return intl.formatMessage({ id: "file.type" }, { type });
  }, [file.type, intl]);
  const { documentRevision } = React.useContext(FormHeaderContext) || {};
  const isPrimary = file.id === documentRevision?.primaryAttachment?.id;

  const isUploadingRenderer = () => (
    <Box>
      <Text translation="common.uploading" />
    </Box>
  );

  const primaryBadgeRender = isPrimary &&
    <StarsRoundedIcon
      data-cy={"primary.attachment.icon"}
      color="primary"
      fontSize="small"
      className={classes.primaryBadge}
    />;
  const deleteButtonRenderer = canDeleteFile && (
    <div className={classes.closeRoot}>
      <IconButton
        className={classes.closeIconButton}
        onClick={handleRemove && handleRemove(file)}
        id="AttachmentIconPresenter-handleRemove"
      >
        <CancelOutlined className={classes.closeIcon} />
      </IconButton>
    </div>
  );
  return (
    <div className={classes.attachmentContainer}>
      <div className={classes.iconContainer}>
        {primaryBadgeRender}
        {deleteButtonRenderer}
        <Tooltip title={`${file.name}.${file.type}`}>
          <ButtonBase
            onContextMenu={handleContextMenu?.(file)}
            key={`icon-${file.id}`}
            onClick={handleIconClick?.(file)}
            id="AttachmentIconPresenter-handleIconClick"
          >
            {isLoading && <CircularProgress className={classes.progress} />}
            {!isLoading && <FileIcon {...other} extension={file.type} isUploading={isUploading} />}
          </ButtonBase>
        </Tooltip>
        {isRedLine && <hr className={classes.underLine}/>}
      </div>
      <div
        className={classes.fileNameContainer}
        onClick={handleIconClick?.(file)}
        onContextMenu={handleContextMenu?.(file)}
      >
        <Typography
          className={classNames(classes.fileName, {
            [classes.isUploading]: isUploading,
          })}
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
          {`${fileSize} ${fileTypeDescription}`}
        </Typography>
      </div>
      {isUploading && isUploadingRenderer()}
    </div>
  );
};

export default AttachmentIconPresenter;
