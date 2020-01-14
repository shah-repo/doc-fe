import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import { Attachment, AttachmentType } from "../../../../state/ducks/attachments";
import Text from "../../Text";
import { VIEWABLE_FILES, WATERMARK_FILES } from "../view.file/utils/constants";
import { AttachmentMenuProps } from "./utils/types";

interface OwnProps {
  handleWatermarkRequest?: (attachment: Attachment) => any;
}

type Props = AttachmentMenuProps & OwnProps;

const AttachmentMenu: React.FunctionComponent<Props> = ({
  handleDownload,
  handleClose,
  anchorEl,
  attachment,
  openFileView,
  handleWatermarkRequest,
}) => {
  const file = attachment || {} as Attachment;
  const isFileViewable =  VIEWABLE_FILES.includes(file.type);
  const canWatermark = WATERMARK_FILES.includes(file.type);
  const {
    name: fileName,
    type: fileType,
    s3linkCleanCopy,
  } = file;
  const handleClick = (type: AttachmentType) => () => {
    handleClose && handleClose();
    handleDownload && handleDownload(file, type)();
  };
  const handleViewFileClick = () => {
    handleClose && handleClose();
    openFileView && openFileView();
  };
  const handleWatermarkClick = () => {
    handleClose && handleClose();
    handleWatermarkRequest && handleWatermarkRequest(file);
  };
  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted={true}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={handleClick(AttachmentType.Attached)}>
        <Text translation="attachment.download.file" values={{ fileName, fileType }} />
      </MenuItem>
      {
        s3linkCleanCopy &&
        <MenuItem onClick={handleClick(AttachmentType.CleanCopy)}>
          <Text translation="attachment.download.clean.copy" values={{ fileName, fileType }} />
        </MenuItem>
      }
      {
        canWatermark &&
        <MenuItem onClick={handleWatermarkClick}>
          <Text translation="attachment.download.watermark" />
        </MenuItem>
      }
      {
        isFileViewable &&
        <MenuItem onClick={handleViewFileClick}>
          <Text translation="common.view.file" />
        </MenuItem>
      }
    </Menu>
  );
};

export default AttachmentMenu;
