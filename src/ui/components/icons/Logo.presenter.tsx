import React from "react";
import Config from "../../../config";
import Text from "../../components/Text";
import { ThemeEnv } from "../../layout/theme/utils/types";
import styles from "./Logo.styles";

const Logo: React.FunctionComponent = () => {
  const classes = styles();
  const theme = Config.Theme;
  const showEnvironment = theme === ThemeEnv.DEV_THEME || theme === ThemeEnv.DEMO_THEME;
  const logo = theme === ThemeEnv.DEV_THEME ?
    "/logo_enlil_dark.svg" :
    "/logo_enlil.svg";

  return (
    <React.Fragment>
      <img
        src={logo}
        alt="Logo"
      />
      {
        showEnvironment &&
        <div className={classes.envCnt}>
          <span className={classes.evnTxt}>
            <Text message={`environment.${theme}`} />
          </span>
        </div>
      }
    </React.Fragment>
  );
};

export default Logo;
