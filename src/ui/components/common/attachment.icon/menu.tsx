import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import React, { useMemo } from "react";
import { Attachment, AttachmentType } from "../../../../state/ducks/attachments";
import Text from "../../Text";
import { WATERMARK_FILES } from "../view.file/utils/constants";
import { checkIfFileIsViewable } from "../view.file/utils/helpers";
import { AttachmentMenuProps, PasswordSubmitActionType } from "./utils/types";

interface OwnProps {
  docRevStatusRequiresPassword: (attachment: Attachment, attachmentType?: AttachmentType) => boolean;
  handleWatermarkRequest?: (attachment: Attachment, attachmentType: AttachmentType) => void;
  setSelectedAttachment: (attachment: Attachment) => void;
  handleIconClick?: (attachment: Attachment) => any;
  setdownloadType: (type: AttachmentType) => any;
}

type Props = AttachmentMenuProps & OwnProps;

const AttachmentMenu: React.FunctionComponent<Props> = ({
  handleClose,
  anchorEl,
  attachment,
  handleIconClick,
  handleWatermarkRequest,
  openWarningDialog,
  setPasswordSubmitAction,
  setSelectedAttachment,
  download,
  docRevStatusRequiresPassword,
  setdownloadType,
}) => {
  const file = useMemo(() => (attachment || {} as Attachment), [attachment]);
  const isFileViewable =  useMemo(() => checkIfFileIsViewable(file.type), [file.type]);
  const canWatermark = useMemo(() => WATERMARK_FILES.includes(file.type), [file.type]);
  const {
    name: fileName,
    type: fileType,
    s3linkCleanCopy,
  } = file;
  const handleClick = (type: AttachmentType) => () => {
    handleClose && handleClose();
    handleDownload && handleDownload(file, type)();
  };
  const handleWatermarkClick = (attachmentType: AttachmentType) => () => {
    handleClose && handleClose();
    handleWatermarkRequest && handleWatermarkRequest(file, attachmentType);
  };
  const handleDownload = (attachment: Attachment, type: AttachmentType) => () => {
    setdownloadType(type);
    if (docRevStatusRequiresPassword(attachment, type)) {
      setSelectedAttachment(attachment);
      setPasswordSubmitAction(PasswordSubmitActionType.DOWNLOAD_FILE);
      openWarningDialog();
    } else {
      download(attachment, type);
    }

  };

  const renderDownloadFile =
    <MenuItem onClick={handleClick(AttachmentType.Attached)}>
      <Text translation="attachment.download.file" values={{ fileName, fileType }} />
    </MenuItem>;
  const renderDownloadCleanCopy = s3linkCleanCopy &&
    <MenuItem onClick={handleClick(AttachmentType.CleanCopy)}>
      <Text translation="attachment.download.clean.copy" values={{ fileName, fileType }} />
    </MenuItem>;
  const renderWatermarkFile = canWatermark &&
    <MenuItem onClick={handleWatermarkClick(AttachmentType.Attached)}>
      <Text translation="attachment.download.watermark" />
    </MenuItem>;
  const renderWatermarkCleanCopy = canWatermark && s3linkCleanCopy &&
    <MenuItem onClick={handleWatermarkClick(AttachmentType.CleanCopy)}>
      <Text translation="attachment.download.watermark.clean.copy" />
    </MenuItem>;
  const renderPreviewFile = isFileViewable &&
    <MenuItem onClick={handleIconClick && handleIconClick(file)}>
      <Text translation="common.view.file" />
    </MenuItem>;

  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted={true}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {renderDownloadFile}
      {renderDownloadCleanCopy}
      {renderWatermarkFile}
      {renderWatermarkCleanCopy}
      {renderPreviewFile}
    </Menu>
  );
};

export default AttachmentMenu;
