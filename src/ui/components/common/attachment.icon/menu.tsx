import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { AttachmentMenuProps } from "./utils/types";
import Text from "../../Text";

const AttachmentMenu: React.FunctionComponent<AttachmentMenuProps> = ({
  handleClose,
  anchorEl,
  file: {
    name: fileName,
    type: fileType,
    s3linkCleanCopy,
  }
}) => {
  const handleClick = () => {
    handleClose && handleClose();
  };
  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={handleClick}>
        <Text translation="attachment.download.file" values={{ fileName, fileType }} />
      </MenuItem>
      { s3linkCleanCopy &&
        <MenuItem onClick={handleClick}>
          <Text translation="attachment.download.clean.copy" values={{ fileName, fileType }} />
        </MenuItem> 
      }
    </Menu>
  );
}

export default AttachmentMenu;