import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { authSelectors } from "../../state/ducks/auth";
import { ChangeRequest, changeRequestsActions, changeRequestsSelectors } from "../../state/ducks/changeRequest";
import { ApplicationState } from "../../state/reducers";
import useAsync from "../hooks/useAsync";
import AssessmentForm from "./forms/AssessmentForm.container";
import { toChangeRequestEditRequestBody, toChangeRequestFormValues } from "./forms/transform";
import { ChangeRequestFormValues } from "./forms/types";
import { canEditChangeRequest } from "./helpers";
import { generateChangeRequestPreviewPath } from "./pathGenerators";
import AsyncGate from "../components/AsyncGate";
import { AsyncState } from "../../state/types";
import { OptionType } from "../components/forms/fields/Autocomplete/types";

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
    <AssessmentForm
      changeRequestId={changeRequest.id}
      asyncState={async.asyncState}
      onSubmit={onSubmit}
      initialValues={toChangeRequestFormValues(changeRequest)}
    />
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  save: changeRequestsActions.save,
})(ChangeRequestUpdateContainer);
