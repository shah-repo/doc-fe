import React from "react";
import { logo, theme } from "../../../common/utils/helpers";
import Text from "../../components/Text";
import { ThemeEnv } from "../../layout/theme/utils/types";
import styles from "./Logo.styles";

const Logo: React.FunctionComponent = () => {
  const classes = styles();
  const showEnvironment = theme === ThemeEnv.DEV_THEME || theme === ThemeEnv.DEMO_THEME;

  return (
    <React.Fragment>
      <img
        id="logo"
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
