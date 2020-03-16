import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { authSelectors } from "../../../../state/ducks/auth";
import { Employee } from "../../../../state/ducks/company";
import { ApplicationState } from "../../../../state/reducers";
import { LOGIN_URL } from "../../../constants/urls";
import Text from "../../Text";
import styles from "./SwitchCompanyButton.styles";

interface StateProps {
  isUserAuthenticated: boolean;
  employees: Employee[];
}

export type SwitchCompanyButtonProps = StateProps & Pick<RouteComponentProps, "location">;

const SwitchCompanyButton: React.FunctionComponent<SwitchCompanyButtonProps> = (props) => {
  const classes = styles();
  const history = useHistory();
  function handleClick() {
    history.push(LOGIN_URL);
  }
  return (
    <div
      id="switchCompanyButton"
      className={classes.switchButton}
      onClick={handleClick}
    >
      <span className={classes.switchButtonText}>
        <Text translation="company.switch.company" />
      </span>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
  employees: authSelectors.employees(state),
});

export default connect<StateProps, {}, {}, ApplicationState>(mapStateToProps)(SwitchCompanyButton);
