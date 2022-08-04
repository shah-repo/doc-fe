import { IconButton } from "@material-ui/core";
import React from "react";
import { ReactComponent as HelpIcon } from "../../../../assets/images/help-md.svg";
import useDialog from "../../../../ui/hooks/useDialog";
import helpContent from "./data/en.json";
import HelpCenterContent from "./HelpCenterContent";
import HelpCenterNavigation from "./HelpCenterNavigation";

const HelpCenter: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const contentDialog = useDialog();

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const openContent = () => {
    closeMenu();
    contentDialog.open();
  };

  return (
    <>
      <IconButton color="inherit" size="small" onClick={openMenu}>
        <HelpIcon />
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
