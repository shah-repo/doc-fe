import { get } from "lodash";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps, useParams } from "react-router-dom";
import { authSelectors } from "../../../../state/ducks/auth";
import { supplierSurveyActions, SupplierSurveyForm, supplierSurveySelectors } from "../../../../state/ducks/supplierSurvey";
import { ApplicationState } from "../../../../state/reducers";
import { AsyncState } from "../../../../state/types";
import AsyncGate from "../../../components/AsyncGate";
import { HOME_URL } from "../../../constants/urls";
import FBStore from "../../../form.builder/stores/ui/FBStore";
import useAsync from "../../../hooks/useAsync";
import SupplierSurveyPresenter from "./SupplierSurvey.presenter";
import SupplierSurveySubmitMessage from "./SupplierSurveySubmitMessage.presenter";

interface StateProps {
  isUserAuthenticated: boolean;
  loadSupplierSurveyListAsyncState: AsyncState;
  supplierSurvey: SupplierSurveyForm;
}

interface DispatchProps {
  loadSupplierSurvey: typeof supplierSurveyActions.loadSupplierSurveyList;
  submitSupplierSurvey: typeof supplierSurveyActions.submitSupplierSurvey;
}

export type SupplierSurveyContainerProps = StateProps &
DispatchProps &
Pick<RouteComponentProps, "location">;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
  loadSupplierSurveyListAsyncState: supplierSurveySelectors.getLoadSupplierSurveyListAsyncInfo(
    state,
  ),
  supplierSurvey: supplierSurveySelectors.supplierSurvey(state),
});

export const SupplierSurveyContainer: React.FunctionComponent<
SupplierSurveyContainerProps
> = ({
  location,
  loadSupplierSurvey,
  loadSupplierSurveyListAsyncState,
  supplierSurvey,
  isUserAuthenticated,
  submitSupplierSurvey,
}) => {
  const async = useAsync({
    onSuccess: () => {
      toggleShowMessage();
    },
  });
  const [showMessage, setShowMessage] = useState(false);
  const toggleShowMessage = () => setShowMessage(!showMessage);

  const { from } = location.state || { from: { pathname: HOME_URL } };
  const { token } = useParams();
  const loadAction = () => loadSupplierSurvey(token);
  if (isUserAuthenticated) {
    return <Redirect to={from} />;
  }

  const onSubmit = () => {
    async.start(submitSupplierSurvey, token, {
      formInput: FBStore.getValues(),
    }, async);
  };

  const schema =
  get(supplierSurvey, "surveyFormDocumentRevision.formTemplate.schema") ||
  get(supplierSurvey, "surveyFormDocumentRevision.formDocument.formTemplate.schema", []);
  FBStore.setFormSchema(schema);

  return (
    <AsyncGate
      asyncAction={loadAction}
      asyncState={loadSupplierSurveyListAsyncState}
      startActionOnMount={true}
    >
      {!showMessage && <SupplierSurveyPresenter
        onSubmit={onSubmit}
        supplierSurvey={supplierSurvey}
        asyncState={async.asyncState}
      />}
      {showMessage && <SupplierSurveySubmitMessage />}
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, {}, ApplicationState>(mapStateToProps, {
  loadSupplierSurvey: supplierSurveyActions.loadSupplierSurveyList,
  submitSupplierSurvey: supplierSurveyActions.submitSupplierSurvey,
})(SupplierSurveyContainer);
