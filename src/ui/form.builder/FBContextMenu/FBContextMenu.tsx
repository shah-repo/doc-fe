import { Box, Menu } from "@material-ui/core";
import React from "react";
import { FBContextMenuProps } from ".";
import { withFBContextMenu } from "./FBContextMenu.wrap";

const FBContextMenu: React.FunctionComponent<FBContextMenuProps> = ({
  onContextMenu,
  onClose,
  onBlur,
  open = false,
  anchorPosition,
  children,
  menuEls,
  boxProps,
}) =>  (
  <Box {...{ onContextMenu, onBlur }} style={{ cursor: "context-menu" }} {...boxProps}>
    {children}
    <Menu
      keepMounted
      {...{ open, onClose, anchorPosition }}
      anchorReference="anchorPosition"
    >
      {menuEls}
    </Menu>
  </Box>
);

export default withFBContextMenu(FBContextMenu);
