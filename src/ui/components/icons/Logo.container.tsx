import React from "react";
import { useSelector } from "react-redux";
import { theme } from "../../../common/utils/helpers";
import { companySelectors } from "../../../state/ducks/company";
import { ThemeEnv } from "../../layout/theme/utils/types";
import Logo from "./Logo.presenter";

const LogoContainer: React.FunctionComponent = () => {

  const whiteLabeling = useSelector(companySelectors.getWhiteLabeling);
  const showEnvironment = theme === ThemeEnv.DEV_THEME || theme === ThemeEnv.DEMO_THEME;
  const navigationLogo = showEnvironment ? "/logo_enlil_dark.svg" : "/logo_enlil.svg";

  if (whiteLabeling.logo) {
    return (
      <img
        src={whiteLabeling.logo}
        style={{ maxWidth: "100%" }}
        alt="Company logo"
      />
    );
  }

  return <Logo logo={navigationLogo} showEnvironment={showEnvironment} />;
};

export default LogoContainer;
