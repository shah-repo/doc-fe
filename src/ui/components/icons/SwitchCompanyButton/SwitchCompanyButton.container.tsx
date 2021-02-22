import { Box } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { authSelectors } from "../../../../state/ducks/auth";
import { Employee } from "../../../../state/ducks/company";
import { ApplicationState } from "../../../../state/reducers";
import Text from "../../Text";

interface StateProps {
  isUserAuthenticated: boolean;
  employees: Employee[];
}

type SwitchCompanyButtonProps = StateProps & Pick<RouteComponentProps, "location">;

const SwitchCompanyButton: React.FunctionComponent<SwitchCompanyButtonProps> = (props) => (
  <Box
    component="span"
    id="switchCompanyButton"
  >
    <Text translation="company.switch.company" />
  </Box>
);

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
  employees: authSelectors.employees(state),
});

export default connect<StateProps, {}, {}, ApplicationState>(mapStateToProps)(SwitchCompanyButton);
