import * as React from "react";
import Text from "../../components/Text";
import rowstyle from "./SwitchCompany.module.css";
import { styles } from "./SwitchCompany.styles";

const SwitchCompanyPresenter: React.FunctionComponent = ({ children }) => {
  const classes = styles();
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.title}>
          <Text translation="company.switch.title" />
        </div>
        <div className={classes.subtitle}>
          <Text translation="company.switch.subtitle" />
        </div>
        <div className={rowstyle.customRows}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SwitchCompanyPresenter;
