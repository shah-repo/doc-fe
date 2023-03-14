import { IconButton } from "@material-ui/core";
import get from "lodash/get";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { ReactComponent as HelpIcon } from "../../../../assets/images/help-md.svg";
import useDialog from "../../../../ui/hooks/useDialog";
import { withThemeNext } from "../../../../ui/layout/theme-next";
import HelpCenterContent from "./components/HelpCenterContent/HelpCenterContent";
import HelpCenterNavigation from "./components/HelpCenterNavigation/HelpCenterNavigation";
import en from "./data/content-en";
import useHelpModule from "./hooks/useHelpModule";
import usePreviousValue from "./hooks/usePreviousValue";

const helpContent = {
  en,
};

interface Props {
  persistent?: boolean;
  draggable?: boolean;
}

const HelpCenter: React.FC<Props> = ({ persistent }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  const contentDialog = useDialog();
  const openContent = () => {
    closeMenu();
    contentDialog.open();
  };

  const currentModule = useHelpModule();
  const { locale, defaultLocale } = useIntl();
  const localizedContent = get(helpContent, locale, helpContent[defaultLocale]);
  const currentContent = get(localizedContent, currentModule, null);

  const previousModule = usePreviousValue(currentModule);
  useEffect(() => {
    if (!persistent && previousModule && currentModule !== previousModule) {
      contentDialog.close();
    }
  }, [persistent, contentDialog, currentModule, previousModule]);

  return (
    <>
      <IconButton color="inherit" size="small" onClick={openMenu} data-cy="help-center.opener">
        <HelpIcon />
      </IconButton>
      <HelpCenterNavigation
        anchorEl={anchorEl}
        hasGuide={Boolean(currentContent)}
        handleCloseMenu={closeMenu}
        handleOpenContent={openContent}
      />
      {currentContent && (
        <HelpCenterContent
          content={currentContent}
          opened={contentDialog.isOpen}
          handleCloseDialog={contentDialog.close}
        />
      )}
    </>
  );
};

export default withThemeNext(HelpCenter);
