import { Menu } from "@material-ui/core";
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
}) =>  (
  <div {...{ onContextMenu, onBlur }} style={{ cursor: "context-menu" }}>
    {children}
    <Menu
      keepMounted
      {...{ open, onClose, anchorPosition }}
      anchorReference="anchorPosition"
    >
      {menuEls}
    </Menu>
  </div>
);

export default withFBContextMenu(FBContextMenu);
