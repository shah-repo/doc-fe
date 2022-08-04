import { IconButton } from "@material-ui/core";
import get from "lodash/get";
import React from "react";
import { useIntl } from "react-intl";
import { ReactComponent as HelpIcon } from "../../../../assets/images/help-md.svg";
import useDialog from "../../../../ui/hooks/useDialog";
import HelpCenterContent from "./components/HelpCenterContent/HelpCenterContent";
import HelpCenterNavigation from "./components/HelpCenterNavigation/HelpCenterNavigation";
import helpContentEn from "./data/en.json";
import { AppModules } from "./HelpCenter.types";

const helpContent = {
  en: helpContentEn,
};

const HelpCenter: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const contentDialog = useDialog();
  const { locale, defaultLocale } = useIntl();

  const localizedHelpContent = get(helpContent, locale, helpContent[defaultLocale]);

  // TODO Get the current module from the store/hoc
  const currentModule = AppModules.PurchaseOrders;
  const currentModuleContent = get(localizedHelpContent, currentModule, null);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const openContent = () => {
    if (currentModuleContent) {
      closeMenu();
      contentDialog.open();
    }
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
      {currentModuleContent && (
        <HelpCenterContent
          content={currentModuleContent}
          isOpen={contentDialog.isOpen}
          handleCloseDialog={contentDialog.close}
        />
      )}
    </>
  );
};

export default HelpCenter;
