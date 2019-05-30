import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { ChangeRequest, changeRequestsActions } from "../../state/ducks/changeRequest";
import { ApplicationState } from "../../state/reducers";
import useAsync from "../hooks/useAsync";
import { toChangeRequestEditRequestBody } from "./forms/transform";
import { ChangeRequestFormValues } from "./forms/types";
import AssessmentFormContainer from "./forms/AssessmentForm.container";
import { generateChangeRequestEditPath } from "./pathGenerators";

interface DispatchProps {
  create: typeof changeRequestsActions.create;
}

interface OwnProps extends RouteComponentProps {
  changeRequest?: ChangeRequest;
}

export type ChangeRequestCreateContainerProps = OwnProps & DispatchProps;

export const DEFAULT_INITIAL_VALUES = {
  description: '',
  justifications: { description: '', attachments: [] },
  assessment: { description: '', attachments: [] },
  implementationPlan: { description: '', attachments: [] },
  approvals: [],
  documentRevisions: [],
};

export const ChangeRequestCreateContainer: React.FunctionComponent<ChangeRequestCreateContainerProps> =
  ({ create, history, changeRequest }) => {
    const async = useAsync<ChangeRequest>({
      onSuccess: (createdChangeRequest?) => {
        history.push(generateChangeRequestEditPath(createdChangeRequest!.id));
      },
    });

    const onSubmitAssessment = (values: ChangeRequestFormValues) => {
      async.start(create, toChangeRequestEditRequestBody(values), async);
    };

    return (
      <AssessmentFormContainer
        initialValues={DEFAULT_INITIAL_VALUES}
        onSubmit={onSubmitAssessment}
        asyncState={async.asyncState}
        availableApprovers={[]}
      />
    );
  };

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  create: changeRequestsActions.create,
})(ChangeRequestCreateContainer);
