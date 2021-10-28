import { Box, Link } from "@material-ui/core";
import React, { useMemo } from "react";
import { trainingActions } from "../../../../state/ducks/training";
import { TrainingPlanTransition } from "../../../../state/ducks/training/types";
import { EffectiveDateFormValues } from "../../../change.request/form/types";
import Text from "../../../components/Text";
import { PasswordFormValues } from "../../../components/transitionDialog/types";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { TrainingControlProps } from "../../utils/types";
import TrainingDialog from "./dialog/TrainingDialog";

type Props = TrainingControlProps;

const TrainingControl: React.FunctionComponent<Props> = ({
  dataProp,
  documentRevisionId,
  docDetails,
}) => {
  const applyTransition = useActionCreator(trainingActions.applyTransition);
  const dialog = useDialog();
  const async = useAsync({ onSuccess: dialog.close });

  const trainingRecord = useMemo(() =>
    dataProp &&
    dataProp.find((record) => !record.completedAt && record.isValid)
  , [dataProp]);

  if (!trainingRecord) {
    return null;
  }

  const transition = TrainingPlanTransition.Complete;
  const label = "training.completed";

  const openDialog = () => {
    async.reset();
    dialog.open();
  };

  const onSubmit = (values: PasswordFormValues | EffectiveDateFormValues) => {
    async.start(
      applyTransition,
      trainingRecord.id,
      documentRevisionId,
      values,
      transition,
      async,
    );
  };

  return (
    <Box mt={5} ml={2}>
      <Link onClick={openDialog}>
        <Text translation="training.acknowledge.completion.link" />
      </Link>
      <TrainingDialog
        transitionDialog={dialog}
        openDialog={openDialog}
        onSubmit={onSubmit}
        asyncState={async.asyncState}
        transition={transition}
        label={label}
        docDetails={docDetails}
        trId={trainingRecord.trId}
      />
    </Box>
  );
};

export default TrainingControl;
