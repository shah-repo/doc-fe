import React from "react";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps, useParams } from "react-router-dom";
import { authSelectors } from "../../../../state/ducks/auth";
import { ApplicationState } from "../../../../state/reducers";
import { HOME_URL } from "../../../constants/urls";
import SupplierSurveyPresenter from "./SupplierSurvey.presenter";

interface StateProps {
  isUserAuthenticated: boolean;
}

export type SupplierSurveyContainerProps = StateProps & Pick<RouteComponentProps, "location">;

export const SupplierSurveyContainer: React.FunctionComponent<SupplierSurveyContainerProps> = (props) => {
  const { from } = props.location.state || { from: { pathname: HOME_URL } };
  const { token } = useParams();
  console.log(token);
  if (props.isUserAuthenticated) {
    return <Redirect to={from} />;
  }

  return (
    <SupplierSurveyPresenter
        token={"123456789"}
    />
  );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
});

export default connect<StateProps, {}, {}, ApplicationState>(mapStateToProps)(SupplierSurveyContainer);
