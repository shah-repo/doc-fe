import React from "react";
import { connect, useSelector } from "react-redux";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { authSelectors } from "../../../state/ducks/auth";
import { companySelectors, Employees } from "../../../state/ducks/company";
import { ApplicationState } from "../../../state/reducers";
import { LOGIN_URL } from "../../constants/urls";
import Text from "../Text";
import styles from "./SwitchCompanyButton.styles";

interface StateProps {
  isUserAuthenticated: boolean;
  companies: Employees[];
}

export type SwitchCompanyButtonProps = StateProps & Pick<RouteComponentProps, "location">;

const SwitchCompanyButton: React.FunctionComponent<SwitchCompanyButtonProps> = (props) => {
  const classes = styles();
  const whiteLabeling = useSelector(companySelectors.getWhiteLabeling);
  const history = useHistory();
  function handleClick() {
    history.push(LOGIN_URL);
  }
  if (!whiteLabeling.colors) {
    return null;
  }
  return (
    <div
      className={classes.switchButton}
      onClick={() => handleClick()}
    >
      <span className={classes.switchButtonText}>
        <Text message={"SWITCH COMPANY"} />
      </span>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
  companies: authSelectors.companies(state),
});

export default connect<StateProps, {}, {}, ApplicationState>(mapStateToProps)(SwitchCompanyButton);
