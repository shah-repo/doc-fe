import { Link, Typography, WithStyles } from "@material-ui/core";
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
import styles from "../styles";
import TrainingDialog from "./dialog/TrainingDialog";

type Props = TrainingControlProps & WithStyles<typeof styles>;

const TrainingControl: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  documentRevisionId,
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
    <span style={{ margin: "50px 0 0 15px" }}>
      <Link onClick={openDialog}>
        <Typography display="inline" className={classes.trainingText}>
          <Text translation="training.acknowledge.completion.link" />
        </Typography>
      </Link>
      <TrainingDialog
        transitionDialog={dialog}
        openDialog={openDialog}
        onSubmit={onSubmit}
        asyncState={async.asyncState}
        transition={transition}
        label={label}
      />
    </span>
  );
};

export default TrainingControl;
