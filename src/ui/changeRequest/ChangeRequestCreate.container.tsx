import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { ChangeRequest, changeRequestsActions } from "../../state/ducks/changeRequest";
import { ApplicationState } from "../../state/reducers";
import useAsync from "../hooks/useAsync";
import ChangeRequestFormContainer from "./forms/ChangeRequestForm.container";
import { toChangeRequestEditRequestBody } from "./forms/transform";
import { ChangeRequestFormValues } from "./forms/types";
import { generateChangeRequestEditPath } from "./pathGenerators";

interface DispatchProps {
  create: typeof changeRequestsActions.create;
}

interface OwnProps extends RouteComponentProps {
  changeRequest?: ChangeRequest;
}

export type ChangeRequestCreateContainerProps = OwnProps & DispatchProps;

export const DEFAULT_INITIAL_VALUES = (): ChangeRequestFormValues => {
  return {
    title: "",
    description: "",
    justifications: { description: "", attachments: [] },
    assessments: { description: "", design: {}, process: {}, regulatory: {} },
    implementationPlan: { tasks: [], attachments: [] },
    approvals: [],
    documentRevisions: [],
  };
};

export const ChangeRequestCreateContainer: React.FunctionComponent<ChangeRequestCreateContainerProps> =
  ({ create, history }) => {
    const async = useAsync<ChangeRequest>({
      onSuccess: (createdChangeRequest?) => {
        history.push(generateChangeRequestEditPath(createdChangeRequest!.id));
      },
    });

    const onSubmitAssessment = (values: ChangeRequestFormValues) => {
      async.start(create, toChangeRequestEditRequestBody(values), async);
    };

    return (
      <ChangeRequestFormContainer
        initialValues={DEFAULT_INITIAL_VALUES()}
        asyncState={async.asyncState}
        onSubmit={onSubmitAssessment}
        doNotPrompt={true}
      />
    );
  };

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  create: changeRequestsActions.create,
})(ChangeRequestCreateContainer);
