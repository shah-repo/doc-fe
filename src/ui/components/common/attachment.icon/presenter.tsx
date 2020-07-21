import { Box, Button, ButtonBase, CircularProgress, Tooltip, Typography } from "@material-ui/core";
import classNames from "classnames";
import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { ReactComponent as RemoveDocumentActive } from "../../../../assets/images/circle-delete-second.svg";
import { ReactComponent as RemoveDocument } from "../../../../assets/images/circle-delete.svg";
import { Attachment } from "../../../../state/ducks/attachments";
import Text from "../../../components/Text";
import { FormHeaderContext } from "../../../documentRevision/forms/DocumentRevisionForm.presenter";
import Colors from "../../../layout/theme/utils/colors";
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
  const [isMouseInside, setMouseInside] = useState(false);
  const [removeHover, setRemoveHover] = useState(false);

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

  const deleteButtonRenderer = canDeleteFile && (
    <Box
      marginLeft="auto"
      marginRight="10px"
      visibility={isMouseInside ? "visible" : "hidden"}
      borderRadius={4}
      bgcolor={Colors.light_red}
      onMouseEnter={() => setRemoveHover?.(!disabled)}
      onMouseLeave={() => setRemoveHover?.(false)}
    >
      <Button
        className={classes.removeButton}
        onClick={handleRemove && handleRemove(file)}
        id="AttachmentIconPresenter-handleRemove"
      >
        {removeHover ?
          <Tooltip title={<Text translation={"common.delete"} />}>
            <RemoveDocumentActive />
          </Tooltip> :
          <RemoveDocument />}
      </Button>
    </Box>
  );

  return (
<<<<<<< Updated upstream
    <div className={classes.attachmentContainer} data-cy="attachment">
      <div className={classes.iconContainer} >
        {primaryBadgeRender}
        {deleteButtonRenderer}
=======
    <div className={classes.attachmentContainer}     onMouseEnter={() => setMouseInside?.(!disabled)}
      onMouseLeave={() => setMouseInside?.(false)}>
      <div className={classes.iconContainer}>
>>>>>>> Stashed changes
        <Tooltip title={`${file.name}.${file.type}`}>
          <ButtonBase
            onContextMenu={handleContextMenu?.(file)}
            key={`icon-${file.id}`}
            onClick={handleIconClick?.(file)}
            id="AttachmentIconPresenter-handleIconClick"
          >
            {isLoading && <CircularProgress className={classes.progress} />}
            {!isLoading &&
              <FileIcon
                {...other}
                extension={file.type}
                isUploading={isUploading}
                isRedLine={isRedLine}
                isPrimary={isPrimary}
              />
            }
          </ButtonBase>
        </Tooltip>
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
          data-cy="attachment.title"
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
      {deleteButtonRenderer}
      {isUploading && isUploadingRenderer()}
    </div>
  );
};

export default AttachmentIconPresenter;
