import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { authSelectors } from "../../state/ducks/auth";
import { ChangeRequest, changeRequestsActions, changeRequestsSelectors } from "../../state/ducks/changeRequest";
import { ApplicationState } from "../../state/reducers";
import useAsync from "../hooks/useAsync";
import AssessmentForm from "./forms/assessmentForm/AssessmentForm.container";
import { toChangeRequestEditRequestBody, toChangeRequestFormValues } from "./forms/transform";
import { ChangeRequestFormValues } from "./forms/types";
import { canEditChangeRequest } from "./helpers";
import { generateChangeRequestPreviewPath } from "./pathGenerators";
import ChangeRequestFormContainer from "./forms/ChangeRequestForm.container";

interface StateProps {
  currentUserEmail: string;
}

interface DispatchProps {
  save: typeof changeRequestsActions.save;
}

interface OwnProps {
  changeRequest: ChangeRequest;
}

export type ChangeRequestUpdateContainerProps = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
});

export const ChangeRequestUpdateContainer: React.FunctionComponent<ChangeRequestUpdateContainerProps> = ({
  save,
  changeRequest,
  currentUserEmail,
}) => {
  const async = useAsync<ChangeRequest>();
  if (!canEditChangeRequest(changeRequest, currentUserEmail)) {
    return <Redirect to={generateChangeRequestPreviewPath(changeRequest.id)} />;
  }

  const onSubmit = (values: ChangeRequestFormValues) => {
    async.start(save, changeRequest.id, toChangeRequestEditRequestBody(values), async);
  };

  return (
    <ChangeRequestFormContainer
      asyncState={async.asyncState}
      onSubmit={onSubmit}
      initialValues={toChangeRequestFormValues(changeRequest)}
      changeRequest={changeRequest}
    />
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  save: changeRequestsActions.save,
})(ChangeRequestUpdateContainer);
