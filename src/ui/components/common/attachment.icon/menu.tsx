import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import { Attachment, AttachmentType } from "../../../../state/ducks/attachments";
import Text from "../../Text";
import { VIEWABLE_FILES } from "../view.file/utils/constants";
import { AttachmentMenuProps } from "./utils/types";

const AttachmentMenu: React.FunctionComponent<AttachmentMenuProps> = ({
  handleDownload,
  handleClose,
  anchorEl,
  attachment,
  openFileView,
}) => {
  const file = attachment || {} as Attachment;
  const isFileViewable =  VIEWABLE_FILES.includes(file.type);
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
        isFileViewable &&
        <MenuItem onClick={handleViewFileClick}>
          <Text translation="common.view.file" />
        </MenuItem>
      }
    </Menu>
  );
};

export default AttachmentMenu;
