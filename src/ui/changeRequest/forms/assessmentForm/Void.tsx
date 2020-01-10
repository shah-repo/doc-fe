import React from "react";
import { ChangeRequest, changeRequestsActions } from "../../../../state/ducks/changeRequest";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import AssessmentFormVoidPresenter from "./VoidPresenter";

interface Props {
  changeRequest: ChangeRequest | undefined;
}
const AssessmentFormVoid: React.FunctionComponent<Props> = ({
  changeRequest,
}) => {
  const dialog = useDialog();
  const appyTransitionAction = useActionCreator(changeRequestsActions.applyTransition);
  const async = useAsync();
  const voidDocument = () => {
    if (changeRequest!.documentRevisions.length > 0) {
      dialog.open();
      return;
    }

    async.start(
      appyTransitionAction,
      changeRequest!.id,
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
      dialog={dialog}
    />
  );
};

export default AssessmentFormVoid;
