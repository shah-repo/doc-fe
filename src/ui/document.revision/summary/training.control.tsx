import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { trainingActions, TrainingPlanTransition } from "../../../state/ducks/training";
import Date from "../../components/Date";
import Text from "../../components/Text";
import TransitionDialog from "../../components/transitionDialog/TransitionDialog";
import { PasswordFormValues } from "../../components/transitionDialog/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import { TrainingControlProps } from "../utils/types";

const TrainingControl: React.FunctionComponent<TrainingControlProps> = ({
  dataProp,
}) => {
  const completedAt = dataProp.completedAt;
  if (completedAt) {
    return (
      <Typography>
        <Text
          translation="training.completed.on"
          values={{ date: <Date value={completedAt} /> }}
        />
      </Typography>
    );
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
      dataProp.id,
      values,
      transition,
      async,
    );
  };

  return (
    <TransitionDialog
      isDialogOpen={dialog.isOpen}
      openDialog={openDialog}
      closeDialog={dialog.close}
      onSubmit={onSubmit}
      asyncState={async.asyncState}
      transition={transition}
      label={label}
    />
  );
};

export default TrainingControl;
