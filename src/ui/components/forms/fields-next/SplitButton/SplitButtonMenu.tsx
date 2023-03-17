import { Menu } from "@material-ui/core";
import React from "react";
import { withThemeNext } from "../../../../layout/theme-next";
import { SplitButtonMenuProps } from "./SplitButton.types";

const SplitButtonMenu: React.FC<SplitButtonMenuProps> = ({
  anchorEl,
  children,
  onClose,
  ...props
}) => (
  <Menu
    {...props}
    open={Boolean(anchorEl)}
    anchorEl={anchorEl}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    onClose={onClose}
    onClick={(e) => onClose && onClose(e, "itemClick")}
  >
    {children}
  </Menu>
);

export default withThemeNext(SplitButtonMenu);
