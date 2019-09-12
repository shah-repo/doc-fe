import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { AttachmentMenuProps } from "./utils/types";
import Text from "../../Text";
import { AttachmentType, Attachment } from "../../../../state/ducks/attachments";

const AttachmentMenu: React.FunctionComponent<AttachmentMenuProps> = ({
  handleDownload,
  handleClose,
  anchorEl,
  attachment,
}) => {
  const file = attachment || {} as Attachment;
  const {
    name: fileName,
    type: fileType,
    s3linkCleanCopy,
  } = file;
  const handleClick = (type: AttachmentType) => () => {
    handleClose && handleClose();
    handleDownload && handleDownload(file, type)();
  };
  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={handleClick(AttachmentType.Attached)}>
        <Text translation="attachment.download.file" values={{ fileName, fileType }} />
      </MenuItem>
      { s3linkCleanCopy &&
        <MenuItem onClick={handleClick(AttachmentType.CleanCopy)}>
          <Text translation="attachment.download.clean.copy" values={{ fileName, fileType }} />
        </MenuItem> 
      }
    </Menu>
  );
}

export default AttachmentMenu;