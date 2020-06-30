import React from "react";
import { ChangeRequest, changeRequestsActions } from "../../../../state/ducks/changeRequest";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import AssessmentFormVoidPresenter from "./Void.presenter";

interface Props {
  changeRequest: ChangeRequest | undefined;
}
const AssessmentFormVoidContainer: React.FunctionComponent<Props> = ({
  changeRequest,
}) => {
  const appyTransitionAction = useActionCreator(changeRequestsActions.applyTransition);
  const async = useAsync();
  const voidDocument = () => {
    changeRequest
    && async.start(
      appyTransitionAction,
      changeRequest.id,
      { password: "" },
      "void",
      async,
    );
  };

  if (!changeRequest) {
    return null;
  }

  return (
    <AssessmentFormVoidPresenter
      asyncState={async.asyncState}
      voidDocument={voidDocument}
    />
  );
};

export default AssessmentFormVoidContainer;
