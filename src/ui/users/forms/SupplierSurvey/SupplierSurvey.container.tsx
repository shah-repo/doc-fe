import React from "react";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps, useParams } from "react-router-dom";
import { authSelectors } from "../../../../state/ducks/auth";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import { supplierSurveyActions, supplierSurveySelectors } from "../../../../state/ducks/supplierSurvey";
import { ApplicationState } from "../../../../state/reducers";
import { AsyncState } from "../../../../state/types";
import { HOME_URL } from "../../../constants/urls";
import SupplierSurveyPresenter from "./SupplierSurvey.presenter";

interface StateProps {
  isUserAuthenticated: boolean;
  loadSupplierSurveyListAsyncState: AsyncState;
  supplierSurvey: DocumentRevision[];
}

interface DispatchProps {
  loadSupplierSurvey: typeof supplierSurveyActions.loadSupplierSurveyList;
}

export type SupplierSurveyContainerProps = StateProps & DispatchProps & Pick<RouteComponentProps, "location">;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
  loadSupplierSurveyListAsyncState: supplierSurveySelectors.getLoadSupplierSurveyListAsyncInfo(state),
  supplierSurvey: supplierSurveySelectors.supplierSurvey(state),
});

export const SupplierSurveyContainer: React.FunctionComponent<SupplierSurveyContainerProps> = ({
  location,
  loadSupplierSurvey,
  loadSupplierSurveyListAsyncState,
  supplierSurvey,
  isUserAuthenticated,
}) => {
  const { from } = location.state || { from: { pathname: HOME_URL } };
  const { token } = useParams();
  const loadAction = () => loadSupplierSurvey(token);

  if (isUserAuthenticated) {
    return <Redirect to={from} />;
  }

  return (
    <SupplierSurveyPresenter
        token={token}
        loadSupplierSurvey={loadAction}
        loadSupplierSurveyListAsyncState={loadSupplierSurveyListAsyncState}
        supplierSurvey={supplierSurvey}
    />
  );
};

export default connect<StateProps, DispatchProps, {}, ApplicationState>(mapStateToProps, {
  loadSupplierSurvey: supplierSurveyActions.loadSupplierSurveyList,
})(SupplierSurveyContainer);
