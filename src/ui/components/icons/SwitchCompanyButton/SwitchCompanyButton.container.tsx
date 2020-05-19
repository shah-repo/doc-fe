import { Box } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { authSelectors } from "../../../../state/ducks/auth";
import { Employee } from "../../../../state/ducks/company";
import { ApplicationState } from "../../../../state/reducers";
import { LOGIN_URL } from "../../../constants/urls";
import FBStore from "../../../form.builder/stores/ui/FBStore";
import Text from "../../Text";

interface StateProps {
  isUserAuthenticated: boolean;
  employees: Employee[];
}

export type SwitchCompanyButtonProps = StateProps & Pick<RouteComponentProps, "location">;

const SwitchCompanyButton: React.FunctionComponent<SwitchCompanyButtonProps> = (props) => {
  const history = useHistory();
  function handleClick() {
    history.push(LOGIN_URL);
    FBStore.clearStores();
  }
  return (
    <Box
      component="span"
      id="switchCompanyButton"
      onClick={handleClick}
    >
      <Text translation="company.switch.company" />
    </Box>
  );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
  employees: authSelectors.employees(state),
});

export default connect<StateProps, {}, {}, ApplicationState>(mapStateToProps)(SwitchCompanyButton);
