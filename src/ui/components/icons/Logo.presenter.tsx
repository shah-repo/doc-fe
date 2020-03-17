import React from "react";
import { theme } from "../../../common/utils/helpers";
import Text from "../../components/Text";
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
