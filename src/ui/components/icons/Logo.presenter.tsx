import React from "react";
import { theme } from "../../../common/utils/helpers";
import Text from "../../components/Text";
import { ThemeEnv } from "../../layout/theme/utils/types";
import styles from "./Logo.styles";

interface Props {
  logo: string;
  showEnvironment: boolean;
}

const Logo: React.FunctionComponent<Props> = ({
  logo,
  showEnvironment,
}) => {
  const classes = styles();
  let evnTxtColor = "";
  if (theme === ThemeEnv.DEV_THEME) {
    evnTxtColor = classes.evnTxtDev;
  } else if (theme === ThemeEnv.DEMO_THEME) {
    evnTxtColor = classes.evnTxtDemo;
  }
  return (
    <React.Fragment>
      <img
        id="logo"
        src={logo}
        alt="Logo"
      />
      {
        showEnvironment &&
        <div className={`${classes.envCnt} ${evnTxtColor}`}>
          <span className={classes.evnTxt}>
            <Text message={`environment.${theme}`} />
          </span>
        </div>
      }
    </React.Fragment>
  );
};

export default Logo;
