import { isEmpty } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { Document, DocumentRevisionDocument } from "../../../state/ducks/documentRevisions/types";
import { trainingActions } from "../../../state/ducks/training";
import { TrainingPlanTransition, TrainingRecord } from "../../../state/ducks/training/types";
import { ApplicationState } from "../../../state/reducers";
import { EffectiveDateFormValues, PasswordFormValues } from "../../change.request/form/types";
import TransitionDialog from "../../components/transitionDialog/TransitionDialog";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";

interface Props {
  trainingRecords: TrainingRecord[];
  id: string;
  document: DocumentRevisionDocument;
}

const CompleteTraining: React.FunctionComponent<Props> = ({
  trainingRecords,
  id,
  document,
}) => {
  const dialog = useDialog();
  const async = useAsync();
  const completeTrainingAction = useActionCreator(trainingActions.completeSelfTaughtTraining);
  const doc: Document = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocument(state, document?.id)
  );
  const docHasRetrain = doc?.documentRevisions.filter((item) => item.retrain);

  const openDialog = () => {
    async.reset();
    dialog.open();
  };

  const transition = TrainingPlanTransition.Complete;
  const label = "training.complete";

  if (!isEmpty(trainingRecords) || isEmpty(docHasRetrain)) {
    return null;
  }

  const onSubmit = (values: PasswordFormValues | EffectiveDateFormValues) => {
    async.start(
      completeTrainingAction,
      id,
      {
        docRev: {
          id,
        },
      },
      values,
      async,
    );
  };

  return (
    <TransitionDialog
      transitionDialog={dialog}
      openDialog={openDialog}
      onSubmit={onSubmit}
      asyncState={async.asyncState}
      transition={transition}
      label={label}
    />
  );
};

export default CompleteTraining;
