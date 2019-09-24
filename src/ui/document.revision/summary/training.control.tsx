import { Typography, WithStyles } from "@material-ui/core";
import React, { useMemo } from "react";
import { trainingActions, TrainingPlanTransition } from "../../../state/ducks/training";
import Text from "../../components/Text";
import TransitionDialog from "../../components/transitionDialog/TransitionDialog";
import { PasswordFormValues } from "../../components/transitionDialog/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import { TrainingControlProps } from "../utils/types";
import styles from "./styles";

type Props = TrainingControlProps & WithStyles<typeof styles>;

const TrainingControl: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  documentRevisionId,
}) => {
  const trainingRecord = useMemo(() => dataProp && dataProp.find((record) => !record.completedAt), [dataProp]);

  if (!trainingRecord) {
    return null;
  }

  const applyTransition = useActionCreator(trainingActions.applyTransition);
  const dialog = useDialog();
  const async = useAsync({ onSuccess: dialog.close });
  const transition = TrainingPlanTransition.Complete;
  const label = "training.completed";

  const openDialog = () => {
    async.reset();
    dialog.open();
  };

  const onSubmit = (values: PasswordFormValues) => {
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
    <span>
      <Typography display="inline" className={classes.trainingText}>
        <Text translation="training.certify.completion" />
      </Typography>
      <TransitionDialog
        isDialogOpen={dialog.isOpen}
        openDialog={openDialog}
        closeDialog={dialog.close}
        onSubmit={onSubmit}
        asyncState={async.asyncState}
        transition={transition}
        label={label}
      />
    </span>
  );
};

export default TrainingControl;
