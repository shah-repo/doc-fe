import { IconButton } from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import React from "react";
import useDialog from "../../../../ui/hooks/useDialog";
import helpContent from "./content/en.json";
import HelpCenterContent from "./HelpCenterContent";
import HelpCenterNavigation from "./HelpCenterNavigation";

const HelpCenter: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const contentDialog = useDialog();

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const openContent = () => {
    setAnchorEl(null);
    contentDialog.open();
  };

  return (
    <>
      <IconButton color="inherit" size="small" onClick={openMenu}>
        <HelpOutlineIcon />
      </IconButton>
      <HelpCenterNavigation
        anchorEl={anchorEl}
        handleCloseMenu={closeMenu}
        handleOpenContent={openContent}
      />
      <HelpCenterContent
        content={helpContent.PO}
        isOpen={contentDialog.isOpen}
        handleCloseDialog={contentDialog.close}
      />
    </>
  );
};

export default HelpCenter;
