import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import React, { useMemo } from "react";
import { Attachment, AttachmentType } from "../../../../state/ducks/attachments";
import { DocumentRevision, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import { FormHeaderSummaryContext } from "../../../document.revision/header/SummaryHeader";
import { documentRevisionStatusContextFromDocList } from "../../../documentRevision/DocumentRevisionsManager.container";
import Text from "../../Text";
import { WATERMARK_FILES } from "../view.file/utils/constants";
import { checkIfFileIsViewable } from "../view.file/utils/helpers";
import MenuItemSetPrimary from "./menu.setPrimary";
import { AttachmentMenuProps, PasswordSubmitActionType } from "./utils/types";

interface OwnProps {
  redLineRequiresPassword: (attachment: Attachment, type?: AttachmentType) => boolean;
  cleanCopyRequiresPassword: (attachment: Attachment) => boolean;
  handleWatermarkRequest?: (
    attachment: Attachment,
    attachmentType: AttachmentType,
    documentRevisionId?: string) => void;
  setSelectedAttachment: (attachment: Attachment) => void;
  handleIconClick?: (attachment: Attachment) => any;
  documentRevision?: DocumentRevision;
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
  redLineRequiresPassword,
  cleanCopyRequiresPassword,
  documentRevision,
}) => {
  const file = useMemo(() => (attachment || {} as Attachment), [attachment]);
  const isFileViewable =  useMemo(() => checkIfFileIsViewable(file.type), [file.type]);
  const canWatermark = useMemo(() => WATERMARK_FILES.includes(file.type), [file.type]);
  const { documentRevisionSummary } = React.useContext(FormHeaderSummaryContext) || {};
  const documentRevisionStatusFromDocList = React.useContext(documentRevisionStatusContextFromDocList);
  const isDocObsoleteOrDeprecated = documentRevisionStatusFromDocList === DocumentRevisionStatus.Obsolete ||
  documentRevisionStatusFromDocList === DocumentRevisionStatus.Deprecated;


  const {
    name: fileName,
    type: fileType,
    s3linkCleanCopy,
  } = file;
  const handleClick = (type: AttachmentType) => () => {
    handleClose && handleClose();
    handleDownload && handleDownload(file, type)();
  };

  const handleWatermarkClick = (attachmentType: AttachmentType, isWatermarkRequest?: boolean) => () => {
    const id = isWatermarkRequest ? documentRevisionSummary?.id as string : undefined;
    handleClose && handleClose();
    handleWatermarkRequest && handleWatermarkRequest(file, attachmentType, id);
  };

  const handleDownload = (attachment: Attachment, type?: AttachmentType) => () => {
    setSelectedAttachment(attachment);
    if (redLineRequiresPassword(attachment, type)
    && type === AttachmentType.CleanCopy) {
      setPasswordSubmitAction(PasswordSubmitActionType.DOWNLOAD_CLEAN_COPY_FILE);
      openWarningDialog();
    } else if (
      cleanCopyRequiresPassword(attachment)
      && type === AttachmentType.CleanCopy) {
      setPasswordSubmitAction(PasswordSubmitActionType.DOWNLOAD_CLEAN_COPY_FILE);
      openWarningDialog();
    } else if (
      redLineRequiresPassword(attachment) &&
      type === AttachmentType.Attached
    ) {
      setPasswordSubmitAction(PasswordSubmitActionType.DOWNLOAD_FILE);
      openWarningDialog();
    } else if (
      cleanCopyRequiresPassword(attachment)
    && type === AttachmentType.Attached
    ) {
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
  const renderPDFFile = canWatermark &&
    <MenuItem data-cy={"attachment.download.pdf"}
      onClick={handleWatermarkClick(AttachmentType.Attached, isDocObsoleteOrDeprecated)}>
      <Text translation="attachment.download.pdf" />
    </MenuItem>;
  // const renderWatermarkFile = (documentRevisionStatusFromDocList === DocumentRevisionStatus.Obsolete ||
  //   documentRevisionStatusFromDocList === DocumentRevisionStatus.Deprecated) && canWatermark &&
  //   <MenuItem onClick={handleWatermarkClick(AttachmentType.Attached, true)}>
  //     <Text translation="attachment.download.watermark" />
  //   </MenuItem>;
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
      {renderPDFFile}
      {renderWatermarkCleanCopy}
      {renderPreviewFile}
      <MenuItemSetPrimary {...{ attachment, handleClose, documentRevision }} />
    </Menu>
  );
};

export default AttachmentMenu;
