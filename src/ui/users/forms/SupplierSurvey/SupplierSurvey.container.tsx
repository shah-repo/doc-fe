import { Formik, FormikProps } from "formik";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps, useParams } from "react-router-dom";
import { authSelectors } from "../../../../state/ducks/auth";
import {
  supplierSurveyActions,
  SupplierSurveyForm,
  supplierSurveySelectors,
} from "../../../../state/ducks/supplierSurvey";
import { ApplicationState } from "../../../../state/reducers";
import { AsyncState } from "../../../../state/types";
import AsyncGate from "../../../components/AsyncGate";
import { HOME_URL } from "../../../constants/urls";
import FBStore from "../../../form.builder/stores/FBStore";
import { FBDocumentFlowProps } from "../../../form.builder/types/formik";
import useAsync from "../../../hooks/useAsync";
import { toSupplierSurveyFormValues } from "../transform";
import SupplierSurveyPresenter from "./SupplierSurvey.presenter";
import SupplierSurveySubmitPresenter from "./SupplierSurveySubmit.presenter";

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
  const async = useAsync();
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
      formInput: JSON.stringify(FBStore.getValues()),
    }, async);
    toggleShowMessage();
  };

  const render = (props: FormikProps<FBDocumentFlowProps>) => {
    if (!showMessage) {
    return (
      <SupplierSurveyPresenter
        {...props}
        asyncState={loadSupplierSurveyListAsyncState}
        supplierSurvey={supplierSurvey}
      />
    );
    }
    return (
      <SupplierSurveySubmitPresenter />
    );
  };

  return (
    <AsyncGate
      asyncAction={loadAction}
      asyncState={loadSupplierSurveyListAsyncState}
      startActionOnMount={true}
    >
      <Formik
        render={render}
        initialValues={toSupplierSurveyFormValues(supplierSurvey)}
        onSubmit={onSubmit}
        enableReinitialize={true}
      />
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, {}, ApplicationState>(mapStateToProps, {
  loadSupplierSurvey: supplierSurveyActions.loadSupplierSurveyList,
  submitSupplierSurvey: supplierSurveyActions.submitSupplierSurvey,
})(SupplierSurveyContainer);
