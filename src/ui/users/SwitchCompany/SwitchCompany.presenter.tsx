import * as React from "react";
import Text from "../../components/Text";
import rowstyle from "./SwitchCompany.module.css";
import { styles } from "./SwitchCompany.styles";

interface Props {
  numberOfCompanies: number;
}

const SwitchCompanyPresenter: React.FunctionComponent<Props> = ({ children, numberOfCompanies }) => {
  const classes = styles();
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div id="switchCompanyHeader" className={classes.title}>
          <Text translation="company.switch.company" />
        </div>
        <div className={classes.subtitle}>
          <Text translation="company.switch.subtitle" />
        </div>
        <div className={numberOfCompanies > 5 ? rowstyle.customRows : ""}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SwitchCompanyPresenter;
